var denodeify = require('as-promise').denodeify,
    fs = require('fs'),
    path = require('path');

 var localePath = './bower_components/angular-locale-partials/dist';
 var templatePath = './output/template.html'
 var outputTestFile = writeFile.bind(null, './output/test.html');
 var createHtml = createHTMLBody.bind(null, fs.readFileSync(templatePath, {encoding:'utf8'}));
 denodeify(fs.readdir, fs)(localePath)
    .then((paths) => paths.map((fileName) => path.join(localePath, fileName)))
    .then(paths => paths.map(getLocaleInfo))
    .then(promises => Promise.all(promises))
    .then(locales => locales.map(getCurrencyInfo))
    .then(locales => locales.map(createCurrencyHTMLPartial))
    .then(partials => partials.join(""))
    .then(createHtml)
    .then(outputTestFile)
    .catch((err) => console.error(err))
    .then(() => process.exit());   
    
    
function getLocaleInfo(path){
    return denodeify(fs.readFile, fs)(path, {encoding: "utf8"})
        .then(text => JSON.parse(text));
}

function getCurrencyInfo(locale){
    return {
        id: locale.id,
        symbol: locale.NUMBER_FORMATS.CURRENCY_SYM
    }
}

function createHTMLBody(template, currencyMarkup){
    return template.replace('${body}',currencyMarkup);
}

function createCurrencyHTMLPartial(currencyInfo){
    return `<p>id: ${currencyInfo.id}, symbol: ${currencyInfo.symbol}</p>`;
}

function writeFile(filename, body){
    return denodeify(fs.writeFile, fs)(filename, body, {encoding: 'utf8'});
}