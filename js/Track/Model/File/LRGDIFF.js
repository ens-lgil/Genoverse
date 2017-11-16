Genoverse.Track.Model.File.LRGDIFF = Genoverse.Track.Model.File.extend({
  parseData: function (text) {
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {
      var fields = lines[i].split("\t");

      if (fields[0] == undefined || fields[0] == '') {
        continue;
      }

      var colour = '#004400';
      var labelColour = '#FFFFFF';
      var label = '';
      if (fields[4] == 'mismatch') {
        label = fields[6];
      }

      if (fields[1] === this.browser.chr || fields[1].toLowerCase() === 'chr' + this.browser.chr || fields[1].match('[^1-9]' + this.browser.chr + '$')) {
        this.insertFeature({
            chr             : fields[1],
            start           : parseInt(fields[2], 10),
            end             : parseInt(fields[3], 10),
            id              : fields[0] + '_' + fields[2] + '-' + fields[3],
            label           : label,
            name            : fields[0],
            type            : fields[4],
            ref_allele      : fields[5],
            alt_allele      : fields[6],
            assembly        : fields[7],
            hgvs            : fields[8],
            color           : colour,
            labelColor      : labelColour,
            originalFeature : fields
        });
      }
    }
  }
});

