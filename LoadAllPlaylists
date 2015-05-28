(function () {
  var INTERVAL = 10 * 1000
  var playlists = _.find(require.s.contexts._.defined, function (m) { return m && m.jumpToMedia })
  var visible = playlists.findWhere({ visible: true })
  next(0)
  function next(i) {
    if (i >= playlists.length) {
      return playlists.setVisible(visible)
    }
    var current = playlists.at(i)
    if (current === visible) {
      return next(i + 1)
    }
    else {
      playlists.setVisible(current)
    }
    setTimeout(function () { next(i + 1) }, INTERVAL)
  }
}())
