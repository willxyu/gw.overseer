
gw = typeof gw !== 'undefined' ? gw: {}

gw.factoriseAttributes = function() {
  var limit  = 950
  for (var i = 0; i < gw.characters.length; i++) {
   var arc   = gw.characters[i]
   var stats = arc._stats
   var output= {}
   if (typeof stats == 'undefined') { stats = {} }
   for (var attr in stats) {
     var val      = stats[attr] / limit
     var opposite = 0
     var adjacent = 0
     var fx       = 0
     var fy       = 0
     // sin(deg) = opposite / hypotenuse, solve for opposite(x)
     // cos(deg) = adjacent / hypotenuse, solve for adjacent(y)
     switch (attr) {
       case 'power'        : fx =   0; fy =   0; break;
       case 'precision'    : fx =  35; fy =  35; break;
       case 'concentration': fx =  80; fy =  80; break;
       case 'healing'      : fx = 120; fy = 120; break;
       case 'expertise'    : fx = 145; fy = 145; break;
       case 'conditions'   : fx = 180; fy = 180; break;
       case 'toughness'    : fx = 260; fy = 260; break;
       case 'vitality'     : fx = 300; fy = 300; break;
       case 'ferocity'     : fx = 325; fy = 325; break;
     }
     output[attr] = {}
     output[attr].fx = Math.sin( fx * Math.PI / 180 ) * Math.min(1, val)
     output[attr].fy = Math.cos( fy * Math.PI / 180 ) * Math.min(1, val)
   }
   for (var j = 0; j < attributes.length; j++) {
     var attr = attributes[j]
     if (typeof output[attr] == 'undefined') {
       output[attr] = { fx: 0, fy: 0 }
     }
   }
   arc._factors = output
  }
}

/*
      $('#' + cssName + '-' + stat)
         // .css('left', 'calc(50% + ' + opposite + 'px)')
         // .css('top',  'calc(50% + ' + (adjacent * -1) + 'px)')
         .css('left', (77 + opposite) + 'px')
         .css('top',  (77 + (adjacent * -1)) + 'px')
    }
    // console.log(coordinates)
    if (typeof coordinates.power == 'undefined') { coordinates.power = {}; coordinates.power.x = 0; coordinates.power.y = 0 }
    if (typeof coordinates.precision == 'undefined') { coordinates.precision = {}; coordinates.precision.x = 0; coordinates.precision.y = 0 }
    if (typeof coordinates.concentration == 'undefined') { coordinates.concentration = {}; coordinates.concentration.x = 0; coordinates.concentration.y = 0 }
    if (typeof coordinates.healingPower == 'undefined') { coordinates.healingPower = {}; coordinates.healingPower.x = 0; coordinates.healingPower.y = 0 }
    if (typeof coordinates.expertise == 'undefined') { coordinates.expertise = {}; coordinates.expertise.x = 0; coordinates.expertise.y = 0 }
    if (typeof coordinates.conditionDamage == 'undefined') { coordinates.conditionDamage = {}; coordinates.conditionDamage.x = 0; coordinates.conditionDamage.y = 0 }
    if (typeof coordinates.toughness == 'undefined') { coordinates.toughness = {}; coordinates.toughness.x = 0; coordinates.toughness.y = 0 }
    if (typeof coordinates.vitality == 'undefined') { coordinates.vitality = {}; coordinates.vitality.x = 0; coordinates.vitality.y = 0 }
    if (typeof coordinates.ferocity == 'undefined') { coordinates.ferocity = {}; coordinates.ferocity.x = 0; coordinates.ferocity.y = 0 }
    
    var drawLine = function(x1, y1, x2, y2, name) {
      var f = 'rotate(' + Math.atan( (y1 - y2) / (x2 - x1) ) + 'rad)'
      // console.log(name + ':' + x1 + ', ' + y1 + ' vs ' + x2 + ', ' + y2)
      if (x1 > x2 && y1 > y2) {
          // console.log(name + ':' + x1 + ', ' + y1 + ' vs ' + x2 + ', ' + y2)
          // console.log(2*Math.PI - Math.atan( (y1 - y2) / (x1 - x2) ))
          f = 'rotate(' + Math.atan( (y1 - y2) / (x1 - x2) ) + 'rad)'
          f = 'rotate(' + (Math.PI - Math.atan( (y1 - y2) / (x1 - x2) )) + 'rad)'
      } else if (x1 > x2 && y1 < y2) {
          // console.log('fix me')
          f = 'rotate(' + (Math.PI - Math.atan( (y1 - y2) / (x1 - x2) )) + 'rad)'
      }

      var x = $('<div class="cc-line ' + name + '">')
          x.css({ 
             // top: 'calc(50% + ' + (y1 * -1) + 'px)', 
             // left: 'calc(50% + ' + x1 + 'px)', 
             top: (77 + (y1 * -1)) + 'px',
             left: (77 + x1) + 'px',
             width: Math.sqrt(( x2 - x1 ) * (x2 - x1) + (y2 - y1) * (y2 - y1)),
             transform: f,
          })
      $('.cc-stats.' + cssName).prepend(x)
    }
    
    drawLine(coordinates.power.x, coordinates.power.y, coordinates.precision.x, coordinates.precision.y, 'power-to-precision')
    drawLine(coordinates.precision.x, coordinates.precision.y, coordinates.concentration.x, coordinates.concentration.y, 'precision-to-concentration')
    
    drawLine(coordinates.concentration.x, coordinates.concentration.y, coordinates.healingPower.x, coordinates.healingPower.y, 'concentration-to-healingPower')
    drawLine(coordinates.expertise.x, coordinates.expertise.y, coordinates.conditionDamage.x, coordinates.conditionDamage.y, 'expertise-to-conditionDamage')
    drawLine(coordinates.healingPower.x, coordinates.healingPower.y, coordinates.expertise.x, coordinates.expertise.y, 'healingPower-to-expertise')
   
    drawLine(coordinates.conditionDamage.x, coordinates.conditionDamage.y, coordinates.toughness.x, coordinates.toughness.y, 'conditionDamage-to-toughness')
    drawLine(coordinates.toughness.x, coordinates.toughness.y, coordinates.vitality.x, coordinates.vitality.y, 'toughness-to-vitality')
    drawLine(coordinates.vitality.x, coordinates.vitality.y, coordinates.ferocity.x, coordinates.ferocity.y, 'vitality-to-ferocity')
    drawLine(coordinates.ferocity.x, coordinates.ferocity.y, coordinates.power.x, coordinates.power.y, 'ferocity-to-power')
*/