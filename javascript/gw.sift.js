gw = typeof gw !== 'undefined' ? gw : {}

gw.sift = function() {
  var inv = gw.compactInventory( gw.characters )
  var equ = gw.compactEquipped( gw.characters )
      inv = inv.concat(equ)
  var shr = gw.compactify( gw.shared )
      inv = inv.concat(shr)
  var ban = gw.compactify( gw.bank )
      inv = inv.concat(ban)
  gw.report('Completed listing of ' + inv.length + ' items. Now retrieving individual data.')
  gw.inv  = inv
  gw.siftInventory( inv )
}

gw.learnPrefixes = function() {
  gw.prefixes = []
  var p = $.when(1)
  var prefixes = $.ajax({ url: 'https://api.guildwars2.com/v2/itemstats' })
  prefixes.done( function(list) {
    list.forEach( function(prefixID, index) {
      p = p.then(function() {
        return $.ajax({ url: 'https://api.guildwars2.com/v2/itemstats/' + prefixID })
      }).then(function(data) {
        gw.prefixes.push(data)
      })
    })
  })
}

gw.siftInventory = function(list) {
  var slots = gw.clone(gw.internalSlots)

  var output = []
  var skins  = []
  var prefixes = []
  
  var p = $.when(1)
  
  list.forEach( function(item, index) {
    p = p.then(function() { return gw.retrieveItem(item.id) }).then( function(data) {
      data.uuid = gw.uuid()  // gen uuid for each
      
      gw.updateProgress(gw.progress.length, list.length)
      
      // gw.updateInventoryDownloader(list.length)
      // console.log('Downloaded ' + gw.inprocess.length + ' / ' + list.length + ' items.')
      if (data.rarity != 'Legendary' && data.rarity != 'Ascended' && data.rarity != 'Exotic') { } else { //  && data.rarity != 'Exotic'
      if (data.type == 'Armor' || data.type == 'Weapon' || data.type == 'Trinket' || data.type == 'Back') {
       Object.assign(item, data)
       output.push(item)
      } }
      if (slots.indexOf(item.slot) != -1) { item.worn = true } else { item.worn = false }
      if (typeof item.skin !== 'undefined') {
       return gw.retrieveSkin(data.uuid, item.skin)
      }
    }).then(function(skinDatum) { /* Retrieve transmuted icons */
      if (typeof skinDatum !== 'undefined') { skins.push(skinDatum) }
    }).catch( function(data) { gw.report('Error accessing id: ' + item.id + '.') } )
  })
  p.then(function() {
    console.log(output)
    gw.filtered = output
    
    for (var i=0; i<gw.filtered.length; i++) {
      var item = gw.filtered[i]

      // Amalgamating 'Back' & 'Trinket' into '._type'
      if (exists(item.type)) {
        if (item.type == 'Back') { item._type = 'Trinket' } else {
          item._type = item.type
        }
      }
      // Adding Worn    '._worn'  field to items
      if (slots.indexOf(item.slot) != -1) { item._worn = true } else { item._worn = false }
      // Adding Subtype '._stype' field to items
      if (exists(item.details)) { 
        if (exists(item.details.type)) { item._stype = item.details.type } else
        if (exists(item.type) && item.type == 'Back') { item._stype = 'Back' } else
        { item._stype = 'Unknown' }
      } else { item._stype = 'Unknown' }
      // Adding Stats   '._stats' field to items
      if (exists(item.details) && exists(item.details.infix_upgrade)) {
        if (exists(item.details.infix_upgrade.attributes)) {
          var _stats = {}
          for (var j = 0; j < item.details.infix_upgrade.attributes.length; j++) {
            var stat = item.details.infix_upgrade.attributes[j].attribute
            var stav = item.details.infix_upgrade.attributes[j].modifier
            _stats[stat] = stav
          }
          item._stats = _stats
        }
        if (exists(item.details.infix_upgrade.id)) { item._prefix = item.details.infix_upgrade.id }
      }
      if (exists(item.stats)) {
        if (exists(item.stats.attributes)) {
          var _stats = {}
          for (var stat in item.stats.attributes) {
            _stats[stat] = item.stats.attributes[stat]
          }
          item._stats = _stats
        }
        if (exists(item.stats.id)) { item._prefix = item.stats.id }
      }
      // Convert ._stats to Display-Format
      if (exists(item._stats)) {
        var newStats = {}
        for (var stat in item._stats) {
          var newName = gw.mapToExternalAttribute(stat)
          newStats[newName] = item._stats[stat]
        }
        item._stats = newStats
      }
      // Add Owner's Profession
      if (exists(item._owner)) {
        for (var j = 0; j < gw.characters.length; j++) {
          if (gw.characters[j].name == item._owner) {
            item._ownerProfession = gw.characters[j].profession
          }
        }
      }
      // Raising access to Weight Class via '._weightClass'
      if (exists(item.details) && exists(item.details.weight_class)) { item._weightClass = item.details.weight_class }

      /* Process retrieved transmuted icons */
      for (var j=0; j<skins.length; j++) {
        if (item.uuid == skins[j].uuid) {
          item.icon_prior = item.icon
          item.icon       = skins[j].skinJSON.responseJSON.icon
          item.name_prior = item.name
          item.name       = skins[j].skinJSON.responseJSON.name
        }
      }
    }
    /* Ready to MATCH */
    $(document).trigger('all-ready')
    
    // UI
    // gw.updateInventory()
  })
}

gw.retrievePrefix = function(uuid, id) {
  return {uuid: uuid, name: $.ajax({ url: 'https://api.guildwars2.com/v2/itemstats/' + id }).done(function(n) { }).fail(function() { gw.report('Error downloading info for prefix-' + id + '.') }) }
}

gw.compactInventory = function(inv) {
  var output = []
  for (var i=0; i<inv.length; i++) {
    var character = inv[i]
    var bags      = character.bags
    for (var j=0; j<bags.length; j++) {
      if (bags[j] !== null) {
      var bag = bags[j].inventory
      for (var k=0; k<bag.length; k++) {
       var item = bag[k]
       if (item !== null) {
       item.owner = character.name
       item._owner = character.name
       item._bagSlot  = j
       item._position = k
       output.push(item) }
      } }
    }
  }
  return output }
gw.compactEquipped  = function(equ) {
  var output = []
  for (var i=0; i<equ.length; i++) {
    var character = equ[i]
    var equipment = character.equipment
    for (var j=0; j<equipment.length; j++) {
      var item = equipment[j]
      item.owner = character.name
      item._owner = character.name
      output.push(item)
    }
  }
  return output }
gw.compactify = function(items) {
  var output = []
  for (var i=0; i<items.length; i++) {
    var item = items[i]
    if (item !== null) {
      output.push(item)
    }
  }
  return output }
  
gw.retrieveItem = function(id) {
 return $.ajax({ url: 'https://api.guildwars2.com/v2/items/' + id }).done(function(n) { gw.progress.push(true) }).fail(function() { gw.progress.push(false); gw.report('Error downloading info for ' + id + '.') })
}

gw.retrieveSkin = function(uuid, skinID) {
 return {uuid: uuid, skinID: skinID, skinJSON: $.ajax({ url: 'https://api.guildwars2.com/v2/skins/'+skinID }).done(function(){}).fail(function(){})}
}

gw.searchInventory = function(id) {
  for (var k in gw.filtered) {
    if (gw.filtered[k].uuid == id) { return gw.filtered[k] }
  }
  return false
}

gw.updateProgress = function(a, b) {
  var w = (a/b) * gw.apiReady.width()
  gw.apiReadyInternal.width(w)

  var o = 1
  //  o = Math.max(1 - (a/b), 0.55)
  var r = Math.max(170 * (1 - (a/b)), 1)
  var g = Math.min(170 * (a/b), 255)
  
  gw.apiReadyInternal
     .css('background', 'rgba( ' + r + ', ' + g + ', 1, ' + o + ')')
  /*
  var h = gw.slotsHeight
  var w = (a/b) * h + 30
  
  // gw.slotsBackground.css('height', w + 'px')
  */
  // $('#progress-current').text(a)
  // $('#progress-total').text(b)
}