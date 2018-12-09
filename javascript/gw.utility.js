
/*
   Utility File
     contains
       debugging, Boolean
       exists(what)
       debug(msg)

       gw.mapToExternalAttribute(internalAttribute)
       gw.mapToInternalAttribute(externalAttribute)
       gw.mapToDisplayAttribute(attribute)
       gw.report(msg)
       gw.lpad(str, len, char)
       gw.rpad(str, len, char)

       gw.internalSlots[]
 */

/* Global Variables */

debugging = true

/* Global Functions */

exists = function(what) {
  if (typeof what !== 'undefined') { return true }
  return false }

debug = function(msg) {
  if (debugging) { gw.report(' (Debugger) ' + msg) } }

/* Utility GW Functions */
var gw = typeof gw !== 'undefined' ? gw : {}

gw.mapToExternalAttribute = function(internal) {
  var t = {
    'BoonDuration'      : 'concentration',
    'ConditionDamage'   : 'conditions',
    'ConditionDuration' : 'expertise',
    'CritDamage'        : 'ferocity',
    'Healing'           : 'healing',
    'Power'             : 'power',
    'Precision'         : 'precision',
    'Toughness'         : 'toughness',
    'Vitality'          : 'vitality',
  }
  return t[internal]
}

gw.mapToInternalAttribute = function(external) {
  var t = {
      'concentration'   : 'BoonDuration',
      'conditionDamage' : 'ConditionDamage',
      'expertise'       : 'ConditionDuration',
      'ferocity'        : 'CritDamage',
      'healingPower'    : 'Healing',
      'power'           : 'Power',
      'precision'       : 'Precision',
      'toughness'       : 'Toughness',
      'vitality'        : 'Vitality',
  }
  return t[external]
}

gw.mapToDisplayAttribute = function(attribute) {
  var t = {
    'concentration'    : 'Concentration',
    'conditionDamage'  : 'Condition Damage',
    'expertise'        : 'Expertise',
    'ferocity'         : 'Ferocity',
    'healingPower'     : 'Healing Power',
    'power'            : 'Power',
    'precision'        : 'Precision',
    'toughness'        : 'Toughness',
    'vitality'         : 'Vitality',
    'BoonDuration'     : 'Concentration',
    'ConditionDamage'  : 'Condition Damage',
    'ConditionDuration': 'Expertise',
    'CritDamage'       : 'Ferocity',
    'Healing'          : 'Healing Power',
    'Power'            : 'Power',
    'Precision'        : 'Precision',
    'Toughness'        : 'Toughness',
    'Vitality'         : 'Vitality',
  }
  return t[attribute]
}

gw.report = function(msg) {
  console.log('[gw.parity]: ' + msg)
}

gw.lpad = function(str, len, char) {
  if (typeof str == "number") { str = str.toString() }
  if (char == null) { char = ' ' }
  var r = len - str.length
  if (r < 0) { r = 0 }
  return char.repeat(r) + str }

gw.rpad = function(str,len,char) {
  if (typeof str == "number") { str = str.toString() }
  if (char == null) { char = ' ' }
  var r = len - str.length
  if (r < 0) { r = 0 }
  return str + char.repeat(r) }

/* GW2 Data */
gw.internalSlots = [
  'WeaponA1', 'WeaponA2', 'WeaponB1', 'WeaponB2',
  'Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots',
  'Backpack',
  'Amulet', 'Accessory1', 'Accessory2', 'Ring1', 'Ring2'
]


gw.clone = function(obj) {
  var copy;
  if (null == obj || 'object' != typeof obj) return obj;
  if (obj instanceof Date) { copy = new Date(); copy.setTime(obj.getTime()); return copy };
  if (obj instanceof Array) { copy = []; for (var i=0;i<obj.length;i++) { copy[i] = gw.clone(obj[i]) }; return copy };
  if (obj instanceof Object) { copy = {}; for (var attr in obj) { if (obj.hasOwnProperty(attr)) { copy[attr] = gw.clone(obj[attr]) } }; return copy };
  throw new Error('Unable to copy obj! Type not supported.');
}

gw.uuid = function() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now();
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(v) {
    var r = (d+Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (v=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
}

gw.title = function(str) {
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

/* Custom Sorting */
/* https://stackoverflow.com/a/27645164 */
gw.sort_by = function(field, reverse, primer){
    var key = primer ? 
         function(x) {return primer(x[field]); }:
         function(x) {return x[field] };
    reverse = [-1, 1][+!!reverse];
    return function (a, b) {
        a = key(a);
        b = key(b);
        return a==b ? 0 : reverse * ((a > b) - (b > a));
                    //^ Return a zero if the two fields are equal!
    }
}

gw.chainSortBy = function(sortByArr) {
    return function(a, b) {
        for (var i=0; i<sortByArr.length; i++) {
            var res = sortByArr[i](a,b);
            if (res != 0)
                return res; //If the individual sort_by returns a non-zero,
                            //we found inequality, return the value from the comparator.
        }
        return 0;
    }
}


gw.clean = function(n) {
 var x = Number(n.replace(/[^-\d\.]/g, ''))
 return x
}

gw.comma = function(x) {
   var parts = x.toString().split('.')
   parts[0]  = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',')
   return parts.join('.') } 