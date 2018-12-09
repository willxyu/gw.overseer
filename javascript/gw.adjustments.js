gw = typeof gw !== 'undefined' ? gw : {}

gw.adjustments = function() {
 // do some calculations to allow us to create blurred backgrounds
  var w = $('body').width()
  var h = $('body').height()
  var WW = w * 0.85
  var n  = WW / 138
      n  = Math.floor(n)
  var x  = n * 138 + 2 + 2
      x  = (w - x) / 2
  $('#content')
    .width(n * 138)
    .css('left', x + 'px')
  // $('#apikey-main').css('left', (x - 55) + 'px')
  $('#key').css('left', (x - 45) + 'px')
  $('#pvp').css('left', (x - 52) + 'px')
  $('#wvw').css('left', (x - 52) + 'px')
  $('#gems').css('left', (x - 52) + 'px')
  $('#gold').css('left', (x - 52) + 'px')
}