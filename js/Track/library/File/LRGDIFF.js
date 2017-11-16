Genoverse.Track.File.LRGDIFF = Genoverse.Track.File.extend({
  name          : 'LRGDIFF',
  model         : Genoverse.Track.Model.File.LRGDIFF,
  bump          : true,
  labels        : 'overlay',
  
  populateMenu: function (feature) {
    return {
      title           : 'Sequence difference between LRG and genome assembly',
      Location        : this.browser.chr + ':' + feature.start + '-' + feature.end,
      Type            : feature.type,
      "Genome allele" : feature.ref_allele,
      "LRG allele"    : feature.alt_allele,
      "HGVS"          : ''+feature.hgvs+'<br /><a style="font-weight:normal" href="https://www.lrg-sequence.org/vep2lrg/?assembly='+feature.assembly+'&hgvs='+feature.hgvs+'&lrg='+feature.name+'" target="_blank" title="Click to see VEP results">Variant Effect Predictor (VEP)</a>'
    };
  },
  
  // Different settings for different zoom level
  5000: { // more than 5k
    bump: false
  },
  1: { // > 1 base-pair, but less then 5k
    bump: true
  }
});

