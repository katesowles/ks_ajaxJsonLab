function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  rawData.forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

Article.fetchAll = function() {
  if (localStorage.rawData) {

    Article.loadAll(
      JSON.parse(localStorage.rawData)
    );

    articleView.initIndexPage();

  } else {

    var newData = $.getJSON( "/data/hackerIpsum.json" )

    newData.done(function (data) {
      Article.loadAll(data);
      localStorage.rawData = JSON.stringify(data);
      articleView.initIndexPage();

    })
  }
};
