
function idle_or_hybrid_morg_calc(fsiya) {
    if(fsiya==0)
        return 0;

    result = Math.ceil(Math.pow(fsiya,2));

    return checkNumber(result);
}

function idle_tindragon_calc(fsiya) {
    if(fsiya==0)
        return 0;

    result = Math.ceil(Math.pow(gold_calc(fsiya),0.8));

    return checkNumber(result);
}

function active_morg_calc(ffrags) {
    if(ffrags==0)
        return 0;

    if(ffrags<100)
        result = Math.ceil(Math.pow((ffrags+1),2));
    else
        result = Math.ceil(Math.pow((ffrags+13),2));


    return checkNumber(result);
}

//idle = Libertas, Mammon, Mimzee
//hybrid = Libertas, Mammon, Mimzee
//active = Mammon, Mimzee, Pluto
function gold_calc(fsiya) {
    result = Math.ceil(fsiya * 0.926);
    return checkNumber(result);
}

function idle_bubos_calc(fsiya) {
    result = 2.8*Math.log(fsiya) - 1.4*Math.log(2.0) - 5.94;
    return checkNumber(result);
}

function idle_chronos_calc(fsiya) {
    result = 2.75*Math.log(fsiya) - 5.1;
    return checkNumber(result);
}

function idle_dora_calc(fsiya) {
    result = 2.877*Math.log(fsiya) - 1.4365*Math.log(1.0/99.0) - 9.63;
    return checkNumber(result);
}

function idle_dogcog_calc(fsiya) {
    result = 2.844*Math.log(fsiya) - 1.422*Math.log(100.0/99.0) - 7.232;
    return checkNumber(result);
}

function idle_fortuna_calc(fsiya) {
    result = 2.875*Math.log(fsiya) - 1.4375*Math.log(1.0/9.0) - 9.3;
    return checkNumber(result);
}

function idle_atman_calc(fsiya,ftp,fascendLevel) {
    result = 2.832*Math.log(fsiya) - 1.416*Math.log(getAlpha(fsiya,ftp,fascendLevel)) - 1.416*Math.log(1.0/3.0) - 6.613;
    return checkNumber(result);
}

function idle_kuma_calc(fsiya,ftp,fascendLevel) {
    result = 2.844*Math.log(fsiya) - 1.422*Math.log(getAlpha(fsiya,ftp,fascendLevel)) - 1.422*Math.log(1.25) - 7.014;
    return checkNumber(result);
}

function checkNumber(num) {
    if(isNaN(num)) 
        return '';
    if(num <= 0)
        return 0;
    return num;
}

function getAlpha(fsiya,ftp,fascendLevel) {
    var hpscale = Math.ceil(fascendLevel/500.0)*0.005 + 1.14;
    return 1.4067 * Math.log(1.0+ftp/100.0) / Math.log(hpscale);
}

function idle_solomon_calc(fsiya,ftp,fascendLevel) {

    var result = 0;
    if(ftp==0)
    {
        //USING 0.26 FORMULA
        calcSolomon = Math.ceil(1.15*Math.pow(Math.log(3.25*Math.pow(fsiya,2)),.4)*Math.pow(fsiya,.8));
        if(fsiya<calcSolomon) 
            result = Math.ceil(fsiya);
        else
            result = calcSolomon;

    }
    else
    {
        result = Math.ceil(Math.pow(fsiya,0.8) / Math.pow(getAlpha(fsiya,ftp,fascendLevel),0.4));
    }
        
    return checkNumber(result);
}

function hybrid_solomon_calc(fsiya) {
    //see https://www.reddit.com/r/ClickerHeroes/comments/3h5al8/extending_mathematical_analysis_to_hybrid_and/
    calcSolomon = Math.ceil(1.32*Math.pow(Math.log(4.65*Math.pow(fsiya,2)),.4)*Math.pow(fsiya,.8));

    return checkNumber(calcSolomon);
}

function active_solomon_calc(ffrags) {

    calcSolomon = Math.ceil(1.21*Math.pow(Math.log(3.73*Math.pow(ffrags,2)),.4)*Math.pow(ffrags,.8));

    if(ffrags<calcSolomon) 
        result = Math.ceil(ffrags);
    else 
        result = calcSolomon;

    return checkNumber(result);
}

function active_bhaal_calc(ffrags) {
    if(ffrags < 1000)
        result=ffrags;
    else
        result=ffrags-90;

    return checkNumber(result);
}

function iris_calc(fsiya,flevels) {
    result = Math.ceil((371 * Math.log(fsiya)) - 1075 - flevels);
    result = Math.max(5*Math.round(result/5) - 2,0);
    result = result >=98 ? result : 0;
    return checkNumber(result);
}

//hybrid bhaal, frag
function hybrid_click_calc(fsiya) {
    result = fsiya >= 1700 ? Math.ceil(fsiya * 0.5) : 0;
    return checkNumber(result);
}

function hybrid_jugg_calc(fsiya) {
    result = fsiya >= 1700 ? Math.ceil(Math.pow(fsiya * 0.5, 0.8)) : 0;
    return checkNumber(result);
}

function idle_revolc_calc(fsiya) {
    result = idle_bubos_calc(fsiya) - 3;
    result = result <= 0 ? 0 : result;
    return checkNumber(result);
}    

function hybrid_skills_calc(fsiya) {
    result = fsiya >= 1700 ? (idle_bubos_calc(fsiya) - 3) : 0;
    result = result <= 0 ? 0 : result;
    return checkNumber(result);
}

function active_jugg_calc(ffrags) {
    result = Math.ceil(Math.pow(ffrags, 0.8));
    return checkNumber(result);
}

