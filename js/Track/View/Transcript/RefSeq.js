Genoverse.Track.View.Transcript.RefSeq = Genoverse.Track.View.Transcript.extend({
  setFeatureColor: function (feature) {
    feature.color = '#009';
    
    for (var i = 0; i < (feature.subFeatures || []).length; i++) {
      if (feature.subFeatures[i].utr) {
        feature.subFeatures[i].color       = false;
        feature.subFeatures[i].borderColor = feature.color;
      }
    }
  }
});

