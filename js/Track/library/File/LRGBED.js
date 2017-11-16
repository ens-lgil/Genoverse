Genoverse.Track.File.LRGBED = Genoverse.Track.File.BED.extend({
  name          : 'LRGBED',
  model         : Genoverse.Track.Model.File.LRGBED,
  
  populateMenu: function (feature) {
    var popup_content = {
      title         : '<a target=_blank href="https://genome.ucsc.edu/FAQ/FAQformat.html#format1">'+feature.name+' details</a>',
      Name          : feature.name,
      Chromosome    : feature.chr,
      Start         : feature.start,
      End           : feature.end,
      Strand        : feature.strand_string,
    };
    if (feature.score) {
      popup_content['Score'] = feature.score;
    }
    if (feature.blockCount) {
      popup_content['Exon count'] = feature.blockCount;
    }
    return popup_content;
  }
});

