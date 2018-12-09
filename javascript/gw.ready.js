gw = typeof gw !== 'undefined' ? gw : {}

gw.ready = function() {
  gw.slotsHeight     = $('#slots').height()
  gw.slotsBackground = $('#slots-background')
  gw.apiReady        = $('#key-progress')
  gw.apiReadyInternal= $('#key-progress-internal')
  // var context = new AudioContext();
   
  // UI-Only Behaviours
  $('#apikey-input').focusin(function(e) {
    $('#apikey-cover').css('display','none')
  }).focusout(function(e) {
    $('#apikey-cover').css('display','block')
  })

  // UI-Interfacing with Data
  // When Input for API changes
  $('#key-input').on('input', function() {
    if (gw.apiPassed()) { gw.save(); gw.retrieveAPIData() }
  })
  
  // Local Storage for settings
  gw.memory()
  // Update #input-api
  $('#key-input').val(window.gwp.api)
  
  // Attempt to Run API on Loads
  if (gw.apiPassed()) { gw.retrieveAPIData() }
}

/*
   Local Storage functions
     gw.memory
     gw.save
 */
gw.memory = function() {
  var gws = {}
      gws.api = 'GDF1F2B4-FB9A-402F-9D79-FF8E9E541114D80A11AE-B510-4774-BD2E-BD2EDDF65340'
      gws.background = ''
      
  var w   = window.localStorage
  var gwp = w.getItem('gwp')
  if (gwp === null) { w.setItem('gwp', JSON.stringify(gws)); gwp = gws } else {
    gws = JSON.parse(gwp)
  }
  
  window.gwp = gws
}

gw.save = function() { window.localStorage.setItem('gwp', JSON.stringify(window.gwp)) }

/*
   API checks & retrieval
 */
gw.apiRegex = /^[A-Z0-9]{8}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{20}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{12}$/g
gw.urlchars = 'https://api.guildwars2.com/v2/characters?page=0&access_token=APIKEY'
gw.urlshare = 'https://api.guildwars2.com/v2/account/inventory?access_token=APIKEY'
gw.urlbank  = 'https://api.guildwars2.com/v2/account/bank?access_token=APIKEY'

gw.urlachievements = 'https://api.guildwars2.com/v2/account/achievements?access_token=APIKEY'
gw.urlwallet= 'https://api.guildwars2.com/v2/account/wallet?access_token=APIKEY'
gw.urlitems = 'https://api.guildwars2.com/v2/itemstats'

gw.apiPassed = function() {
  var key = $('#key-input').val()
  if (key.match(gw.apiRegex) !== null) {
    gwp.api = key
    return true
  } else {
    return false
  }
}

gw.retrieveAPIData = function() {
  var key           = gwp.api
  gw.progress       = []
  var urlAchieves   = gw.urlachievements
  var urlWallet     = gw.urlwallet
  var urlCharacters = gw.urlchars
  var urlShared     = gw.urlshare
  var urlBank       = gw.urlbank
  var urlItems      = gw.urlitems
  gw.inventoryReady = false
  
  // retrieve kill-counts via achievements
  $.ajax({ url: urlWallet.replace('APIKEY', key),
    success: function(r) {
      gw.wallet = r
      $(document).trigger('wallet-ready')
  $.ajax({ url: urlAchieves.replace('APIKEY', key),
    success: function(r) {
      gw.achievements = r
      $(document).trigger('achieve-ready')
  // learn some prefixes
  $.ajax({ url: urlItems,
    success: function(r) {
      gw.prefixList = r
      $(document).trigger('prefixList-ready')
  // start compiling Characters, Shared Inventory, Bank items
  $.ajax({ url: urlCharacters.replace('APIKEY', key),
    success: function(r) { 
     gw.characters = r
     $(document).trigger('chr-ready')
    $.ajax({ url: urlShared.replace('APIKEY', key),
      success: function(r) {
      gw.shared = r
      $.ajax({ url: urlBank.replace('APIKEY', key),
        success: function(r) { 
          gw.bank = r
          /* Do something */
          gw.sift()
        }
      })
      }
    })
    }
  })
  }
  })
  }
  })
  }
  })
}