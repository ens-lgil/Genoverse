// Ensembl REST API Transcript model
Genoverse.Track.Model.Transcript.RefSeq = Genoverse.Track.Model.Transcript.extend({
  urlRestSuffix    : '/overlap/region/human/__CHR__:__START__-__END__?db_type=otherfeatures;feature=transcript;feature=exon;feature=cds;content-type=application/json',
  dataRequestLimit : 5000000, // As per e! REST API restrictions

  setDefaults: function () {
    this.geneIds   = {};
    this.seenGenes = 0;

    this.base.apply(this, arguments);
  },

  // The url above responds in json format, data is an array
  // See rest.ensembl.org/documentation/info/overlap_region for more details
  parseData: function (data, chr) {
    var model        = this;
    var featuresById = this.featuresById;
    var ids          = [];

    data.filter(function (d) { return d.feature_type === 'transcript'; }).forEach(function (feature, i) {
      if (feature.source == 'BestRefSeq' && (feature.id.indexOf('NM_') != -1 || feature.id.indexOf('NR_') != -1) && feature.id.indexOf('XM_') == -1) { // || feature.source == 'refseq') {
        if (!featuresById[feature.id]) {
          model.geneIds[feature.Parent] = model.geneIds[feature.Parent] || ++model.seenGenes;

          var label = (feature.external_name) ? feature.external_name + ' (' + feature.id + ')' : feature.id;

          feature.chr         = feature.chr || chr;
          feature.label       = parseInt(feature.strand, 10) === 1 ? label + ' >' : '< ' + label;
          feature.sort        = (model.geneIds[feature.Parent] * 1e10) + feature.start + i;
          feature.cdsStart    = Infinity;
          feature.cdsEnd      = -Infinity;
          feature.exons       = {};
          feature.subFeatures = [];

          model.insertFeature(feature);
        }

        ids.push(feature.id);
      }
    });

    data.filter(function (d) { return d.feature_type === 'cds' && featuresById[d.Parent]; }).forEach(function (cds) {
      if (cds.source == 'BestRefSeq') { // || cds.source == 'refseq') {
        featuresById[cds.Parent].cdsStart = Math.min(featuresById[cds.Parent].cdsStart, cds.start);
        featuresById[cds.Parent].cdsEnd   = Math.max(featuresById[cds.Parent].cdsEnd,   cds.end);
      }
    });

    data.filter(function (d) { return d.feature_type === 'exon' && featuresById[d.Parent] && !featuresById[d.Parent].exons[d.id]; }).forEach(function (exon) {
      if (exon.source == 'BestRefSeq') { // || exon.source == 'refseq') {
        if (exon.end < featuresById[exon.Parent].cdsStart || exon.start > featuresById[exon.Parent].cdsEnd) {
          exon.utr = true;
        } else if (exon.start < featuresById[exon.Parent].cdsStart) {
          featuresById[exon.Parent].subFeatures.push($.extend({ utr: true }, exon, { end: featuresById[exon.Parent].cdsStart }));

          exon.start = featuresById[exon.Parent].cdsStart;
        } else if (exon.end > featuresById[exon.Parent].cdsEnd) {
          featuresById[exon.Parent].subFeatures.push($.extend({ utr: true }, exon, { start: featuresById[exon.Parent].cdsEnd }));

          exon.end = featuresById[exon.Parent].cdsEnd;
        }

        featuresById[exon.Parent].subFeatures.push(exon);
        featuresById[exon.Parent].exons[exon.id] = exon;
      }
    });

    ids.forEach(function (id) {
      featuresById[id].subFeatures.sort(function (a, b) { return a.start - b.start; });
    });
  }
});
