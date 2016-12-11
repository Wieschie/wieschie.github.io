$(function(){
    $('#savegame').keyup(import_save);

    $('#idle_siya').change(idle_mathmagic);
    $('#idle_siya').keyup(idle_mathmagic);

    $('#idle_tp').change(idle_mathmagic);
    $('#idle_tp').keyup(idle_mathmagic);

    $('#zoneInput').change(idle_mathmagic);
    $('#zoneInput').keyup(idle_mathmagic);

    $('#numberFormat').change(idle_mathmagic);
    $('#numberFormat').keyup(idle_mathmagic);

    // $('#hybrid_siya').change(hybrid_mathmagic);
    // $('#hybrid_siya').keyup(hybrid_mathmagic);

    // $('#active_frags').change(active_mathmagic);
    // $('#active_frags').keyup(active_mathmagic);

    $('#outsiders_as').change(outsiders_mathmagic);
    $('#outsiders_as').keyup(outsiders_mathmagic);

    $('#outsiders_playstyle').change(outsiders_mathmagic);
    $('#outsiders_playstyle').keyup(outsiders_mathmagic);

    //new hybrid tab 2/16/16- show "new" until 3/16/16 then stop
    //new howto tab, 3/17/2016 = show "new" until 4/1/16 then stop
    var untildate = new Date('2016-04-01'); 
    var now = new Date();
    if(now > untildate)
    {
        //It's after "end" date
        $('.hideafter').each(function(index,obj) { $(obj).hide(); });
    }

    idle_mathmagic();
});

var phanMap = {
    1:{asmin:3},
    2:{asmin:10},
    3:{asmin:21},
    4:{asmin:36},
    5:{asmin:54},
    6:{asmin:60},
    7:{asmin:67},
    8:{asmin:75},
    9:{asmin:84},
    10:{asmin:94},
    11:{asmin:104},
    12:{asmin:117},
    13:{asmin:129},
    14:{asmin:143},
    15:{asmin:158},
    16:{asmin:174},
    17:{asmin:190},
    18:{asmin:208},
    19:{asmin:228}};

function getPhanLevel(fas,xyl) {
    var leftoverAS = fas-xyl;
    
    var phanLevel = 0;
    for (var key in phanMap) {
        if (phanMap.hasOwnProperty(key)
           && (+leftoverAS >= +phanMap[key].asmin)
           && (+key > +phanLevel)) {
            phanLevel = key;
        }
    }
    
    return phanLevel;
}

function outsiders_mathmagic() {
    outsiders_rules_of_thumb();
    outsiders_spreadsheet();
}

function outsiders_spreadsheet() {
    var fas = parseInt($('#outsiders_as').val());
    var fplaystyle = $("#outsiders_playstyle option:selected").val();

    var spreadsheetValues = {xy:"?", ch:"?", ph:"?", bo:"?", pb:"?"};

    if( fplaystyle == "idle") {
        if( idleMap.hasOwnProperty(fas) ) {
            spreadsheetValues = idleMap[fas];
        }
    }
    else if( fplaystyle == "hybrid" ) {
        if( hybridMap.hasOwnProperty(fas) ) {
            spreadsheetValues = hybridMap[fas];
        }
    }
    else if( fplaystyle == "active" ) {
        if( activeMap.hasOwnProperty(fas) ) {
            spreadsheetValues = activeMap[fas];
        }
    }
    
    $('#outsiders_xyl_sheet').text(spreadsheetValues.xy);
    $('#outsiders_chor_sheet').text(spreadsheetValues.ch);
    $('#outsiders_phan_sheet').text(spreadsheetValues.ph);
    $('#outsiders_borb_sheet').text(spreadsheetValues.bo);
    $('#outsiders_pony_sheet').text(spreadsheetValues.pb);
}

function outsiders_rules_of_thumb() {
    var fas = parseInt($('#outsiders_as').val());
    var fplaystyle = $("#outsiders_playstyle option:selected").val();
    var remainingAS = fas;

    var xyl = 0;
    if( fplaystyle == "idle") {
        xyl = Math.floor(fas*0.2)*1;
        xyl = xyl > 10 ? 10 : xyl;
    }
    else if( fplaystyle == "hybrid" ) {
        xyl = Math.floor(fas*0.05)*1;
        xyl = xyl > 5 ? 5 : xyl;
    }

    $('#outsiders_xyl').text(xyl);
    remainingAS -= xyl;

    if(remainingAS <= 0) {
        $('#outsiders_phan').text(0);
        $('#outsiders_borb').text(0);
        $('#outsiders_chor').text(0);
        $('#outsiders_pony').text(0);
        return;
    }

    var phanLevel = getPhanLevel(fas,xyl);
    var phanCost = (phanLevel*1*(phanLevel*1+1))/2; //sum of 1..n
    $('#outsiders_phan').text(phanLevel);
    

    remainingAS -= phanCost;
    if(remainingAS <= 0) {
        $('#outsiders_borb').text(0);
        $('#outsiders_chor').text(0);
        $('#outsiders_pony').text(0);
        return;
    }

    var borb = Math.ceil(remainingAS*0.1)*1
    $('#outsiders_borb').text(borb);
    remainingAS -= borb;

    if(remainingAS <= 0) {
        $('#outsiders_chor').text(0);
        $('#outsiders_pony').text(0);
        return;
    }

    if(remainingAS <= 19) {
        $('#outsiders_chor').text(0);
        $('#outsiders_pony').text(remainingAS);
        return;
    }
    
    var pony = 19;
    $('#outsiders_pony').text(pony);
    remainingAS -= pony;

    if(remainingAS <= 10) {
        $('#outsiders_chor').text(remainingAS);
        return;
    }

    var chor = 10;
    $('#outsiders_chor').text(chor);
    remainingAS -= chor;
    
    if(borb < 10) {
        var borb_uplift = 10 - borb;
        if(borb_uplift <= remainingAS) {
            $('#outsiders_borb').text(10);
            borb = 10;
            remainingAS -= borb_uplift;
        } else { //(borb_uplift > remainingAS) 
            borb += remainingAS;
            $('#outsiders_borb').text(borb);
            return;
        }
    }
    
    var halfRoundedUp = Math.ceil(remainingAS/2.0)*1;
    pony += halfRoundedUp;
    $('#outsiders_pony').text(pony);
    borb += remainingAS - halfRoundedUp;
    $('#outsiders_borb').text(borb);
}

function formatNumber(someNumber) {
    if( "numbers" === $("#numberFormat option:selected").val() ) {
        return numeral(someNumber).format('0,0');
    } 

    if( "scientific" === $("#numberFormat option:selected").val() ) {
        return formatExponentialNumber( someNumber, 6 );
    }

    return formatGameNumber(someNumber)
}

function formatExponentialNumber( number, maxDigits )
{
    var formatter = "";

    var numstring = numeral(number).format('0');

    var digits = numstring.length;
    var gamenumber = number.toString().toLowerCase();
    if( gamenumber.includes("e") )
    {
        formatter = number.toExponential(3);
    }
    else if( digits <= maxDigits )
    {
        formatter = numeral(number).format('0,0');
    }
    else
    {
        formatter = number.toExponential(3);
    }
    
    formatter = formatter.replace( "+", "" );

    return formatter;
}


function formatGameNumber(someNumber) {
    
    var suffixes = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D", "!", "@", "#", "$", "%", "^", "&", "*"];

    var suffix="none";

    for( i = (suffixes.length - 1); i >= 0; i-- ) {
        if( someNumber < (100000 * Math.pow(1000, i) ) ) {
            suffix = suffixes[i];
        }
    }
    
    if( suffix == "none" )
    {
        //number too big for game notation.
        return formatExponentialNumber( someNumber, 6 );
    }

    /*
       1 0 -> 0
       2 00 -> 00
       3 000 -> 000
       4 0000 -> 0,000
       5 00000 -> 00,000

       6 000000 -> 000K
       7 0000000 -> 0,000K
       8 00000000 -> 00,000K

       9 000000000 -> 000M
      10 0000000000 -> 0,000M
      11 00000000000 -> 00,000M

      12 000000000000 -> 000B
     */

    var numberForSuffix = someNumber / Math.pow(1000.0, suffixes.indexOf(suffix));
    var numstring = numeral(numberForSuffix).format('0');    

    return numeral(numstring).format('0,0') + suffix;
}

function formatGameNumberOriginalStyle(someNumber) {
// javascript starts forcing exponential notation for numbers over 1e21
//    var tempnumber = someNumber.toString().toLowerCase();
//    if( tempnumber.includes("e") ) {
//        return formatExponentialNumber(someNumber,6);
//    }

    var numstring = numeral(someNumber).format('0');
    /*
       1 0 -> 0
       2 00 -> 00
       3 000 -> 000
       4 0000 -> 0,000
       5 00000 -> 00,000
       6 000000 -> 000K
       7 0000000 -> 0,000K
       8 00000000 -> 00,000K
       9 000000000 -> 000M
      10 0000000000 -> 0,000M
      11 00000000000 -> 00,000M
      12 000000000000 -> 000B
     */

    var digits = numstring.length;
    var suffixIndex = 0;
    var suffixes = ["", "K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d", "U", "D", "!", "@", "#", "$", "%", "^", "&", "*"];
    
    while(digits > 5 && suffixIndex < (suffixes.length-1))
    {
        numstring = numstring.slice(0,-3);
        digits = numstring.length;
        suffixIndex++;
    }
    
    var suffix = "";
    if (suffixIndex > (suffixes.length-1))
    {
        suffix = suffixes[suffixes.length-1];
    }
    else
    {
        suffix = suffixes[suffixIndex];
    }

    return numeral(numstring).format('0,0') + suffix;
}

function idle_mathmagic() {
    var fsiya = parseFloat($('#idle_siya').val());
    var ftp = parseFloat($('#idle_tp').val());
    var fzone = parseInt($('#zoneInput').val());
    
    $('#idle_morg').text(formatNumber(idle_or_hybrid_morg_calc(fsiya)));
    $('#idle_tindragon').text(formatNumber(idle_tindragon_calc(fsiya)));
    $('#idle_solomon').text(formatNumber(idle_solomon_calc(fsiya, ftp, fzone)));

    $('#idle_bubos').text(formatNumber(idle_bubos_calc(fsiya)));
    $('#idle_chronos').text(formatNumber(idle_chronos_calc(fsiya)));
    $('#idle_gold').text(formatNumber(gold_calc(fsiya)));
    $('#idle_dora').text(formatNumber(idle_dora_calc(fsiya)));
    $('#idle_dogcog').text(formatNumber(idle_dogcog_calc(fsiya)));
    $('#idle_fortuna').text(formatNumber(idle_fortuna_calc(fsiya)));

    //ballpark
    $('#idle_revolc').text(formatNumber(idle_revolc_calc(fsiya)) + "-ish");

    if( ftp >0 )
    {
        $('#idle_atman').text(formatNumber(idle_atman_calc(fsiya, ftp, fzone)));
        $('#idle_kuma').text(formatNumber(idle_kuma_calc(fsiya, ftp, fzone)));
    }
    else
    {
        //ballpark it - no rule   
        $('#idle_atman').text(formatNumber(idle_bubos_calc(fsiya)) + "-ish");
        $('#idle_kuma').text(formatNumber(idle_bubos_calc(fsiya)) + "-ish");
    }
        
    $('#hybrid_click').text(formatNumber(hybrid_click_calc(fsiya)));
    
    $('#hybrid_jugg').text(formatNumber(hybrid_jugg_calc(fsiya)));

    //ballpark
    $('#hybrid_skills').text(formatNumber(hybrid_skills_calc(fsiya)) + "-ish");

    //update formulas;
//    update_idle_or_hybrid_morg_formula(fsiya);
//    update_idle_solomon_formula(fsiya);
}

function hybrid_mathmagic() { /// currently unused, dead code.  
    var fsiya = parseFloat($('#hybrid_siya').val());
    
    $('#hybrid_morg').val(numeral(idle_or_hybrid_morg_calc(fsiya)).format('0,0'));
    
    $('#hybrid_gold').val(numeral(gold_calc(fsiya)).format('0,0'));
    
    $('#hybrid_solomon').val(numeral(hybrid_solomon_calc(fsiya)).format('0,0'));

    $('#hybrid_iris').val(irisDisplayText(fsiya,1000,302));
    
    $('#hybrid_click').val(numeral(hybrid_click_calc(fsiya)).format('0,0'));
    
    $('#hybrid_jugg').val(numeral(hybrid_jugg_calc(fsiya)).format('0,0'));

    //update formulas;
    update_idle_or_hybrid_morg_formula(fsiya);
}

function active_mathmagic() {
    var ffrags = parseFloat($('#active_frags').val());

    $('#active_bhaal').val(numeral(active_bhaal_calc(ffrags)).format('0,0'));

    $('#active_jugg').val(numeral(active_jugg_calc(ffrags)).format('0,0'));
    
    $('#active_gold').val(numeral(gold_calc(ffrags)).format('0,0'));
    
    $('#active_morg').val(numeral(active_morg_calc(ffrags)).format('0,0'));

    $('#active_solomon').val(numeral(active_solomon_calc(ffrags)).format('0,0'));

    //update formulas
    update_active_morg_formula(ffrags);
    update_active_solomon_formula(ffrags);
    update_active_bhaal_formula(ffrags);

}


function irisDisplayText(fsiya, fLevelFrom, fLevelTo) {
    var irisFrom = iris_calc(fsiya,fLevelFrom);
    var irisTo = iris_calc(fsiya,fLevelTo);

    if(irisFrom == irisTo)
    {
        return numeral(irisFrom).format('0,0');
    }
    
    return "~ " + numeral(irisFrom).format('0,0') 
        + " to ~ " + numeral(irisTo).format('0,0');
}

function is_idle() {
    var accordion_visible_index =  $( "#accordion" ).accordion( "option", "active" );
    return accordion_visible_index == 0;
}

function is_hybrid() {
    var accordion_visible_index =  $( "#accordion" ).accordion( "option", "active" );
    return accordion_visible_index == 1;
}

function is_active() {
    var accordion_visible_index =  $( "#accordion" ).accordion( "option", "active" );
    return accordion_visible_index == 2;
}

function level_up(add_levels) {
    if( is_idle() )
    {
        var level = parseInt(idle_siya.value) || 0;
        level += add_levels;
        idle_siya.value = level;
        idle_mathmagic();
    } 
    else if( is_hybrid() )
    {
        var level = parseInt(hybrid_siya.value) || 0;
        level += add_levels;
        hybrid_siya.value = level;
        hybrid_mathmagic();
    } 
    else if( is_active() )
    {
        var level = parseInt(active_frags.value) || 0;
        level += add_levels;
        active_frags.value = level;
        active_mathmagic();
    }
}

function multiply_up(m) {
    if( is_idle() )
    {
        var level = parseFloat(idle_siya.value) || 0;
        level *= m;
        idle_siya.value = Math.ceil(level);
        idle_mathmagic();
    }
    else if( is_hybrid() )
    {
        var level = parseFloat(hybrid_siya.value) || 0;
        level *= m;
        hybrid_siya.value = Math.ceil(level);
        hybrid_mathmagic();
    }
    else if( is_active() )
    {
        var level = parseFloat(active_frags.value) || 0;
        level *= m;
        active_frags.value = Math.ceil(level);
        active_mathmagic();
    }
}


//decodes the savegame, and sets checkbox based on status of Morg.  Also sets argaiv/siyalatas, but I might remove that.
const ANTI_CHEAT_CODE = "Fe12NAfA3R6z4k0z";
const SALT = "af0ik392jrmt0nsfdghy0";
function import_save() {
    var txt = $('#savegame').val();
    
    if (txt.search(ANTI_CHEAT_CODE) != -1) {
        var result = txt.split(ANTI_CHEAT_CODE);
        txt = "";
        for (var i = 0; i < result[0].length; i += 2) {
            txt += result[0][i];
        }
        if (CryptoJS.MD5(txt + SALT) != result[1]) {
            // alert("This is not a valid Clicker Heroes savegame!");
            return;
        }
    }
    var data = $.parseJSON(atob(txt));

    console.log(data);

    //idle and hybrid
    if(data.ancients.ancients.hasOwnProperty(5))    {
        // has Siyalatas == 5
        idle_siya.value = data.ancients.ancients[5].level;
        idle_mathmagic();
//        hybrid_siya.value = data.ancients.ancients[5].level;
//        hybrid_mathmagic();
        zoneInput.value = data.highestFinishedZonePersist;
        idle_mathmagic;
    }
    else if(data.ancients.ancients.hasOwnProperty(28))      {
        // has Argaiv
        idle_siya.value = data.ancients.ancients[28].level;
        idle_mathmagic();
//        hybrid_siya.value = data.ancients.ancients[28].level;
//        hybrid_mathmagic();
        zoneInput.value = data.highestFinishedZonePersist;
        idle_mathmagic;
    }


    //3 is phan = tp boost
    if( data.outsiders && data.outsiders.outsiders.hasOwnProperty(3) ) {
        var phanLevel = data.outsiders.outsiders[3].level;
        var totalAS = data.ancientSoulsTotal;
        
        if(totalAS > 0)
            idle_tp.value = 1 + 49*(1 - Math.pow(Math.E,(-0.0001*totalAS))) + 50*(1 - Math.pow(Math.E,(-0.001*phanLevel)));
        else
            idle_tp.value = 0;
        idle_mathmagic;
    }

    
    outsiders_as.value = data.ancientSoulsTotal ? data.ancientSoulsTotal : 0;

    outsiders_mathmagic();
    

    //active
    // if(data.ancients.ancients.hasOwnProperty(19))    {
    //     // has frags == 19
    //     active_frags.value = data.ancients.ancients[19].level;
    //     active_mathmagic();
    // }
    // else if(data.ancients.ancients.hasOwnProperty(28))      {
    //     // has Argaiv
    //     active_frags.value = data.ancients.ancients[28].level;
    //     active_mathmagic();
    // }
}

function show_math() {

    if( is_idle() )
    {
        $('#idle_formulas').toggle();
        $('#idle_formula_button').html( $('#idle_formulas').is(':visible') ? "Hide Formulas" : "Show Formulas" );
    }
    else if( is_hybrid() )
    {
        $('#hybrid_formulas').toggle();
        $('#hybrid_formula_button').html( $('#hybrid_formulas').is(':visible') ? "Hide Formulas" : "Show Formulas" );
    }
    else if( is_active() )
    {
        $('#active_formulas').toggle();
        $('#active_formula_button').html( $('#active_formulas').is(':visible') ? "Hide Formulas" : "Show Formulas" );
    }
}

function update_idle_or_hybrid_morg_formula(fsiya) {
    var formula;
    if( is_idle() )
    {
        formula = MathJax.Hub.getAllJax("idle_morg_formula")[0];
    }
    else if( is_hybrid() )
    {
        formula = MathJax.Hub.getAllJax("hybrid_morg_formula")[0];
    }
    
    if(formula)
    {
        if(fsiya<100)
            MathJax.Hub.Queue(["Text",formula,"Morgulis = (Siya+1)^2"]);
        else
            MathJax.Hub.Queue(["Text",formula,"Morgulis = (Siya+22)^2"]);
    }
}

function update_active_morg_formula(ffrags) {
    var formula = MathJax.Hub.getAllJax("active_morg_formula")[0];

    if(ffrags<100)
        MathJax.Hub.Queue(["Text",formula,"Morgulis = (Frags+1)^2"]);
    else
        MathJax.Hub.Queue(["Text",formula,"Morgulis = (Frags+13)^2"]);
}

// function update_idle_solomon_formula(fsiya) {
//     var formula = MathJax.Hub.getAllJax("idle_solomon_formula")[0];

//     var calcSolomon = idle_solomon_calc(fsiya);

//     if(fsiya==calcSolomon) 
//         MathJax.Hub.Queue(["Text",formula,"Solomon = Siyalatas"])
//     else 
//         MathJax.Hub.Queue(["Text",formula,"Solomon = 1.15 * \ln{(3.25 * Siya^2)}^{0.4} * Siya^{0.8}"]);
// }

function update_active_solomon_formula(ffrags) {
    var formula = MathJax.Hub.getAllJax("active_solomon_formula")[0];

    calcSolomon = active_solomon_calc(ffrags);

    if(ffrags==calcSolomon) 
        MathJax.Hub.Queue(["Text",formula,"Solomon = Fragsworth"])
    else 
        MathJax.Hub.Queue(["Text",formula,"Solomon = 1.21 * \ln{(3.73 * Frags^2)}^{0.4} * Frags^{0.8}"]);
}

function update_active_bhaal_formula(ffrags) {

    var formula = MathJax.Hub.getAllJax("active_bhaal_formula")[0];

    if(ffrags < 1000)
        MathJax.Hub.Queue(["Text",formula,"Bhaal = Fragsworth"])
    else
        MathJax.Hub.Queue(["Text",formula,"Bhaal = Frags - 90"])
}

