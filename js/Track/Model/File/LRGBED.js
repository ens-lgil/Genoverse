Genoverse.Track.Model.File.LRGBED = Genoverse.Track.Model.File.BED.extend({
  parseData: function (data, chr) {
    var lines       = typeof data === 'string' ? data.split('\n') : data;
    var thinHeight  = this.prop('thinHeight');
    var thickHeight = this.prop('thickHeight');
    var fields, len, feature, subfeatures, subfeature, blockSizes, blockStarts, j, thinFeature, thinFeature1, thinFeature2, thickFeature;

    function filterNumber(n) {
      return !isNaN(n);
    }

    for (var i = 0; i < lines.length; i++) {
      fields = lines[i].split('\t').filter(function(f) { return f; });

      len = fields.length;

       if (len < 3 || fields[0] == 'track' || fields[0] == 'browser') {
        continue;
      }

      if (fields[0] == chr || fields[0].toLowerCase() == 'chr' + chr || fields[0].match('[^1-9]' + chr + '$')) {

        var label  = fields[3];
        var strand = fields[5];
        var strand_string = "";
        if (strand == '-') {
          label = '< ' + label;
          strand_string = "<span style=\"color:#D00\">&larr;</span> Reverse";
        }
        else {
          label = label + ' >';
          strand_string = "Forward <span style=\"color:#00D\">&rarr;</span>";
        }
        label = label.replace(/\(/i, " (");
        var item_name = fields[3];
            item_name = item_name.replace(/\(/i, " ("); 

        var chr = fields[0];
            chr = chr.replace(/^chr/i, "");
 
        feature = {
          chr             : chr,
          start           : parseInt(fields[1], 10),
          end             : parseInt(fields[2], 10),
          strand          : strand,
          strand_string   : strand_string,
          id              : fields[1] + '-' + fields[3],
          label           : label,
          name            : item_name,
          thickStart      : fields[6],
          thickEnd        : fields[7],
          originalFeature : fields
        };
        
        if (len > 3) { feature.score  = parseFloat(fields[4], 10); }

      
        if (fields[6]) {
          feature.color = '#00BB00';
        }
        else if (fields[8]) {
          feature.color = 'rgb(' + fields[8] + ')';
        } else {
          feature.color = '#009900';
        }
        
        if (len > 7) {
          feature.thickStart = fields[6];
          feature.thickEnd   = fields[7];
          feature.drawThick  = (feature.thickStart === feature.thickEnd) ? false : true;
        }

        
        if (len == 12) { // subfeatures present
          feature.blockCount = parseInt(fields[9],10);

          subfeatures = [];
          blockSizes  = fields[10].split(',').filter(filterNumber);
          blockStarts = fields[11].split(',').filter(filterNumber);

          for (j = 0; j < blockSizes.length; j++) {
            subfeature = {
              start  : feature.start + parseInt(blockStarts[j], 10),
              height : thinHeight // if subfeature lies entirely left / right to [ thickStart, thickEnd ]
            };

            subfeature.end = subfeature.start + parseInt(blockSizes[j], 10);

            if (feature.drawThick && subfeature.start <= feature.thickEnd && subfeature.end >= feature.thickStart) {
              // some kind of an overlap for sure
              if (subfeature.start > feature.thickStart && subfeature.end < feature.thickEnd) {
                // subfeature within thickBlock, draw thick
                subfeature.height = thickHeight;
                subfeatures.push(subfeature);
              } else if (subfeature.start < feature.thickStart && subfeature.end <= feature.thickEnd) {
                // left overlap, split subfeature into 2 - thin | thick
                thinFeature  = $.extend({}, subfeature, { end: feature.thickStart, color: false, borderColor: feature.color });
                thickFeature = $.extend({}, subfeature, { start: feature.thickStart, height: thickHeight });

                subfeatures = subfeatures.concat([thinFeature, thickFeature]);
              } else if (subfeature.start >= feature.thickStart && subfeature.end > feature.thickEnd) {
                // right overlap, split subfeature into 2 - thick | thin
                thinFeature  = $.extend({}, subfeature, { start: feature.thickEnd, color: false, borderColor: feature.color });
                thickFeature = $.extend({}, subfeature, { end: feature.thickEnd, height: thickHeight });

                subfeatures = subfeatures.concat([ thickFeature, thinFeature ]);
              }else{
                // thickBlock lies within subfeature, split into 3 - thin | thick | thin
                // the least possible case but lets be prepared for the outliers
                thinFeature1 = $.extend({}, subfeature, { end: feature.thickStart });
                thinFeature2 = $.extend({}, subfeature, { start: feature.thickEnd });
                thickFeature = { start: feature.thickStart, end: feature.thickEnd, height: thickHeight };

                subfeatures = subfeatures.concat([ thinFeature1, thickFeature, thinFeature2 ]);
              }
            } else {
              // no thick block
              subfeature.color = false;
              subfeature.borderColor = feature.color;
              subfeatures.push(subfeature);
            }
          }

          if (subfeatures.length) {
            feature.subFeatures = subfeatures;
          }
        }

        this.insertFeature(feature);
        
      }
    }
  }
});

