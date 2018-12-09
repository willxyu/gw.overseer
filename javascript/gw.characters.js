gw = typeof gw !== 'undefined' ? gw : {}

gw.actionsCharacters = function() {
  $('.slot').on('mouseenter', function(e) {
    var classes    = $(this)[0].classList
    var selector   = ''
    var subselector= ''
    var exclusions = ['Legendary','Ascended','Exotic']
    for (var j = 0; j < classes.length; j++) {
      if (exclusions.indexOf(classes[j]) == -1) {
        selector += '.' + classes[j]
        if (classes[j] != 'slot') { subselector += '.' + classes[j] }
      }
    }
    $(selector).addClass('highlighted')
    $('.slot:not(' + subselector + ')').addClass('fade')

    gw.actionsExtended(subselector)
    $('.extended-info').css('display','block')

  }).on('mouseleave', function(e) {
    $('.highlighted').removeClass('highlighted')
    $('.slot').removeClass('fade')

    $('.extended-info').css('display','none')
  })
  
  //
  $('.profplate').on('mouseenter', function(e) {
    gw.actionsExtendedProfession()
    $('.extended-info').css('display','block')
  }).on('mouseleave', function(e) {
  
    $('.extended-info').css('display','none')
  })
}

gw.actionsExtended = function(selector) {
  var s = selector.split('.')
  // console.log(s)
  var m = s[(s.length-1)] // this may not always be true!
      m = m.charAt(0).toUpperCase() + m.substr(1)
  // Empty out previous values
  $('.extended-info').removeClass('profession')
  $('.extended-attr-value').text('')
  $('.extended-attr-value')
     .removeClass('tier1')
     .removeClass('tier2')
     .removeClass('tier3')
     .removeClass('tier4')
     .removeClass('tier5')
  $('.extended-name').text('')
  $('.extended-rarity').text('')
  $('.extended-prefix').text('')
  $('.extended-name.Legendary').removeClass('Legendary')
  $('.extended-name.Ascended').removeClass('Ascended')
  $('.extended-name.Exotic').removeClass('Exotic')
  $('.extended-rarity.Legendary').removeClass('Legendary')
  $('.extended-rarity.Ascended').removeClass('Ascended')
  $('.extended-rarity.Exotic').removeClass('Exotic')
  for (var i = 0; i < gw.characters.length; i++) {
    var arc  = gw.characters[i]
    var uuid = arc.uuid
    var equip= arc.equipment

    $('#extended-icon-' + uuid)
       .removeClass('Legendary')
       .removeClass('Ascended')
       .removeClass('Exotic')
       .css('background-image', 'none')
    for (var j = 0; j < equip.length; j++) {
      var item = equip[j]
      if (typeof item.icon != 'undefined' && typeof item.slot != 'undefined' && item.slot == m) {
        // Item Located
        //   update icon
        $('#extended-icon-' + uuid)
           .addClass(item.rarity)
           .css('background-image', 'url("' + item.icon + '")')
        //   update name
        if (typeof item.name != 'undefined') {
          $('#extended-name-' + uuid)
             .text(item.name)
             .addClass(item.rarity)
        }
        /*
        //   update rarity
        if (typeof item.rarity != 'undefined') {
          $('#extended-rarity-' + uuid)
             .text(item.rarity)
             .addClass(item.rarity)
        }
        */
        //   update prefix
        if (typeof item._prefix != 'undefined') {
          var prefix = item._prefix
          if (typeof gw.prefixes != 'undefined' && typeof gw.prefixes[item._prefix] != 'undefined') {
            prefix = gw.prefixes[item._prefix]
          }
          $('#extended-prefix-' + uuid).text(prefix)
        }
        
        //   update stats
        if (typeof item._stats != 'undefined') {
          for (var attr in  item._stats) {
            var val = item._stats[attr]
            $('#extended-attr-' + attr + '-value-' + uuid).text('+' + val)
          }
        }
        break
      }
    }
  }
}

gw.actionsExtendedProfession = function() {
  $('.extended-info').addClass('profession')
  $('.extended-attr-value').text('')
  $('.extended-name').text('')
  $('.extended-rarity').text('')
  $('.extended-prefix').text('')
  $('.extended-name.Legendary').removeClass('Legendary')
  $('.extended-name.Ascended').removeClass('Ascended')
  $('.extended-name.Exotic').removeClass('Exotic')
  $('.extended-rarity.Legendary').removeClass('Legendary')
  $('.extended-rarity.Ascended').removeClass('Ascended')
  $('.extended-rarity.Exotic').removeClass('Exotic')
  for (var i = 0; i < gw.characters.length; i++) {
    var arc  = gw.characters[i]
    var uuid = arc.uuid
    $('#extended-icon-' + uuid)
       .removeClass('Legendary')
       .removeClass('Ascended')
       .removeClass('Exotic')
       .css('background-image', 'none')
    if (typeof arc._stats != 'undefined') {
      for (var attr in arc._stats) {
        var color = ''
        if (arc._stats[attr] > 1000) { color = 'tier5' }
        else if (arc._stats[attr] > 750) { color = 'tier4' }
        else if (arc._stats[attr] > 500) { color = 'tier3' }
        else if (arc._stats[attr] > 250) { color = 'tier2' }
        else { color = 'tier1' }
        $('#extended-attr-' + attr + '-value-' + uuid)
          .text('+' + arc._stats[attr])
          .addClass(color)
      }
    }
  }
}

gw.displayCharacters = function() {
  for (var i = 0; i < gw.characters.length; i++) {
    var uuid = gw.uuid()
    gw.characters[i].uuid = uuid
    gw.addCharacter(gw.characters[i])
  }
}

gw.addCharacter = function(data) {
  var size = options.panelSize
  var uuid = data.uuid
  var name = data.name
  var prof = data.profession
  var cir  = ''

  cir +=   '<div id="extended-circle-' + uuid + '" class="extended-circle">'
  // custom
  cir += '<div id="extended-circle-lines-power-to-precision-' + uuid + '"         class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-precision-to-concentration-' + uuid + '" class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-concentration-to-healing-' + uuid + '"   class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-healing-to-expertise-' + uuid + '"       class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-expertise-to-conditions-' + uuid + '"    class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-conditions-to-toughness-' + uuid + '"    class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-toughness-to-vitality-' + uuid + '"      class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-vitality-to-ferocity-' + uuid + '"       class="extended-circle-line"></div>'
  cir += '<div id="extended-circle-lines-ferocity-to-power-' + uuid + '"          class="extended-circle-line"></div>'

  var str  = ''
  str += '<div id="character-' + uuid + '" class="chr ' + size + '">'
  str += '<div id="Armor-Helm-' + uuid + '"      class="slot armor helm"></div>'
  str += '<div id="Armor-Shoulders-' + uuid + '" class="slot armor shoulders"></div>'
  str += '<div id="Armor-Coat-' + uuid + '"      class="slot armor coat"></div>'
  str += '<div id="Armor-Gloves-' + uuid + '"    class="slot armor gloves"></div>'
  str += '<div id="Armor-Leggings-' + uuid + '"  class="slot armor leggings"></div>'
  str += '<div id="Armor-Boots-' + uuid + '"     class="slot armor boots"></div>'
  str += '<div id="Trinket-Backpack-' + uuid + '"   class="slot trinket backpack"></div>'
  str += '<div id="Trinket-Accessory1-' + uuid + '" class="slot trinket accessory1"></div>'
  str += '<div id="Trinket-Accessory2-' + uuid + '" class="slot trinket accessory2"></div>'
  str += '<div id="Trinket-Amulet-' + uuid + '"     class="slot trinket amulet"></div>'
  str += '<div id="Trinket-Ring1-' + uuid + '"      class="slot trinket ring1"></div>'
  str += '<div id="Trinket-Ring2-' + uuid + '"      class="slot trinket ring2"></div>'
  str += '<div id="Weapon-WeaponA1-' + uuid + '" class="slot weapon weaponA1"></div>'
  str += '<div id="Weapon-WeaponA2-' + uuid + '" class="slot weapon weaponA2"></div>'
  str += '<div id="Weapon-WeaponB1-' + uuid + '" class="slot weapon weaponB1"></div>'
  str += '<div id="Weapon-WeaponB2-' + uuid + '" class="slot weapon weaponB2"></div>'
  str += '<div id="profplate-' + uuid + '" class="profplate ' + prof + '"></div>'
  str += '<div id="nameplate-' + uuid + '" class="nameplate ' + prof + '">' + name + '</div>'
  str += '<div id="extended-info-' + uuid + '" class="extended-info">'
  str +=   '<div id="extended-name-' + uuid + '" class="extended-name"></div>'
  // str +=   '<div id="extended-rarity-' + uuid + '" class="extended-rarity"></div>'
  str +=   '<div id="extended-prefix-' + uuid + '" class="extended-prefix"></div>'
  str +=   '<div id="extended-icon-' + uuid + '" class="extended-icon"></div>'
  for (var i = 0; i < attributes.length; i++) {
    var attr = attributes[i]
    str += '<div id="extended-attr-' + attr + '-' + uuid + '" class="extended-attr ' + attr + '">'
    str += '<div id="extended-attr-' + attr + '-value-' + uuid + '" class="extended-attr-value ' + attr + '">'
    str += '</div>'
    str += '<div id="extended-attr-' + attr + '-icon-' + uuid + '" class="extended-attr-icon ' + attr + '">'
    str += '</div>'
    str += '</div>'
 
    cir += '<div id="extended-circle-' + attr + '-' + uuid + '" class="extended-circle-point ' + attr + '">'
    cir += '</div>'
  }

  str += cir + '</div>'

  str += '</div>'
  str += '</div>'
  $('#display').append(str)
}

gw.updatesCharacters = function() {
  for (var i = 0; i < gw.characters.length; i++) {
    var arc   = gw.characters[i]
    var uuid  = arc.uuid
    var equip = arc.equipment
    for (var j = 0; j < equip.length; j++) {
      var item = equip[j]
      if (typeof item.slot !== 'undefined') {
        $('#' + item._type + '-' + item.slot + '-' + arc.uuid)
          .css('background-image', 'url("' + item.icon + '")')
          .addClass(item.rarity)
      }
    }

    // pre-calculate factorisers
    var radius  = 34
    var factors = arc._factors
    for (var j = 0; j < attributes.length; j++) {
      var attr = attributes[j]
      if (typeof factors[attr] != 'undefined') {
        $('#extended-circle-' + attr + '-' + uuid)
          .css('left', (34 + (factors[attr].fx * radius)) + 'px')
          .css('top',  (34 + (factors[attr].fy * radius * -1)) + 'px')
      }
    }

    var drawLine = function( x1, y1, x2, y2, name ) {
      var x1 = x1 * radius
      var y1 = y1 * radius
      var x2 = x2 * radius
      var y2 = y2 * radius
      var f  = 'rotate(' + Math.atan( (y1 - y2) / (x2 - x1) ) + 'rad)'
      if (x1 > x2 && y1 > y2) {
          f = 'rotate(' + (Math.PI - Math.atan( (y1 - y2) / (x1 - x2) )) + 'rad)'
      } else if (x1 > x2 && y1 < y2) {
          f = 'rotate(' + (Math.PI - Math.atan( (y1 - y2) / (x1 - x2) )) + 'rad)'
      }
      $(name).css({
        top      : (34 + (y1 * -1)) + 'px',
        left     : (34 + x1) + 'px',
        width    : Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)),
        transform: f,
      })
    }

    drawLine( factors.power.fx,         factors.power.fy,
              factors.precision.fx,     factors.precision.fy,
              '#extended-circle-lines-power-to-precision-'         + uuid)
    drawLine( factors.precision.fx,     factors.precision.fy,
              factors.concentration.fx, factors.concentration.fy, 
              '#extended-circle-lines-precision-to-concentration-' + uuid)
    drawLine( factors.concentration.fx, factors.concentration.fy,
              factors.healing.fx,       factors.healing.fy, 
              '#extended-circle-lines-concentration-to-healing-'   + uuid)
    drawLine( factors.healing.fx,       factors.healing.fy,
              factors.expertise.fx,     factors.expertise.fy,
              '#extended-circle-lines-healing-to-expertise-'       + uuid)
    drawLine( factors.expertise.fx,     factors.expertise.fy,
              factors.conditions.fx,    factors.conditions.fy,
              '#extended-circle-lines-expertise-to-conditions-'    + uuid)
    drawLine( factors.conditions.fx,    factors.conditions.fy,
              factors.toughness.fx,     factors.toughness.fy,
              '#extended-circle-lines-conditions-to-toughness-'    + uuid)
    drawLine( factors.toughness.fx,     factors.toughness.fy,
              factors.vitality.fx,      factors.vitality.fy,
              '#extended-circle-lines-toughness-to-vitality-'      + uuid)
    drawLine( factors.vitality.fx,      factors.vitality.fy,
              factors.ferocity.fx,      factors.ferocity.fy,
              '#extended-circle-lines-vitality-to-ferocity-'       + uuid)
    drawLine( factors.ferocity.fx,      factors.ferocity.fy,
              factors.power.fx,         factors.power.fy,
              '#extended-circle-lines-ferocity-to-power-'          + uuid)

  }
}