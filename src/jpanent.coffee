#jpanent获取法律状态
casper = require("casper").create(
  verbose: true
  logLevel: 'debug'
  #clientScripts: ["includes/jquery.min.js", "includes/underscore-min.js"], #如果需要注入jquery的库可以在这里输入
  waitTimeout: 60 * 1000 #等待超时
  pageSettings:
    loadImages: false #The WebPage instance used by Casper will
    loadPlugins: false #use these settings
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36'
)
casper.start "https://www4.j-platpat.inpit.go.jp/eng/tokujitsu/tkbs_en/TKBS_EN_GM101_Top.action" ,->
  @echo @getTitle()
  @fill 'form[id="searchForm"]' , "bTmFCOMDTO.InputDocNumList[0]": "2003-179582",false
  @capture "1.jpg"
  @click "input[id='button_searchresult']"

casper.waitForSelector "a#unexPubLink0" ,->
  @capture "2.jpg"
  @click "a#unexPubLink0"

casper.waitForSelector "#resultForm > div.contents > div > div.grid > iframe" ,->
  @capture "3.jpg"
  url = @evaluate ->
    return $('#resultForm > div.contents > div > div.grid > iframe').attr "src"
  @open url

casper.waitForSelector "body > form" ,->
  @capture "4.jpg"
  @fill "form[name='KeikaLink']", {} , true

casper.waitForPopup "www1" ,->
  @capture "5.jpg"
  @echo @getCurrentUrl()

casper.withPopup "www1",->
  @capture "6.jpg"
  @echo @getCurrentUrl()
  datas = @evaluate ->
    formdata = []
    $("table tr").each ->
      tmp = {}
      tmp[$(this).find("th").text()] = $(this).find("td").text()
      formdata.push tmp
      return
    return formdata
  @echo JSON.stringify datas

casper.run ->
  @exit()
