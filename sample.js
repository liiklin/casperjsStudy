var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    // clientScripts: ["includes/jquery.min.js", "includes/underscore-min.js"], //如果需要注入jquery的库可以在这里输入
    waitTimeout: 30000,//等待超时
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false, // use these settings
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
    }
});

casper.start('https://www4.j-platpat.inpit.go.jp/eng/tokujitsu/tkbs_en/TKBS_EN_GM101_Top.action', function() {
    this.echo(this.getTitle());
    this.fill('form[id="searchForm"]', {
        "bTmFCOMDTO.InputDocNumList[0]": "2003-179582"
    }, false);
    this.click('input[id="button_searchresult"]');
    this.capture("1.png");
    this.echo("已经点击查询按钮, 跳转等待.....");
}).waitForSelector("a#unexPubLink0", function() {
    this.capture("2.png");
    this.echo("查询成功");
    this.click('a#unexPubLink0');
}).waitForSelector('#resultForm > div.contents > div > div.grid > iframe', function() {
    this.capture("3.png");
    var url = this.evaluate(function() {
        return $('#resultForm > div.contents > div > div.grid > iframe').attr("src");
    });
    console.log(url);
    this.open(url);
}).waitForSelector('body > form', function() {
    this.capture("4.png");
    this.echo(this.getCurrentUrl());
    this.fill('form[name="KeikaLink"]', {}, true);
}).waitForPopup('www1', function() {
    this.echo(this.getCurrentUrl());
    this.capture('5.png');
}).withPopup('www1', function() {
    this.echo(this.getCurrentUrl());
    this.capture('6.png');
    var datas = this.evaluate(function() {
        var formdata = [];
        $('table tr').each(function() {
            var tmp = {};
            tmp[$(this).find('th').text()] = $(this).find('td').text()
            formdata.push(tmp);
        });
        alert(JSON.stringify(formdata));
        return formdata;
    });
    this.echo(JSON.stringify(datas));
});
casper.run();
