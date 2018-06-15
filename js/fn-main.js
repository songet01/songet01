   var snackbarContainer = document.querySelector('#show-notywrap');
   var shButtom = $('#sh-input');
   var api__sh = "https://www.googleapis.com/youtube/v3/search";
   var api__list = "https://www.googleapis.com/youtube/v3/playlistItems";
   var api__key = "AIzaSyD-RErq2rwmWf-b2M3OJCTcF9VurRhR9Uo";
   var api__fields = "items/id/videoId,items/snippet/title,items/snippet/thumbnails";
   var api__listop = "PLFgquLnL59alcyTM2lkWJU34KtfPXQDaX";

   var proxylist = ['aHR0cDovL3Byb3h5LmhhY2tlcnlvdS5jb20vP3JlcVVybD1odHRwczovL2Rvd255dG1wMy5jb20mcGFyYW1zW3RvbXAzXT0='];
   var currentProxy = atob(proxylist[Math.floor(Math.random() * proxylist.length)]);

   $(function() {

       top__tracks();


       shButtom.on('keypress', function(e) {
           var a = e.keyCode ? e.keyCode : e.which,
               t = $(e.target).val();
           13 == a && sm__handler(t);
       });

       if (location.href.indexOf('t=') > -1) {
           actionbyParams(location.href, "search");
       }
   });



   var attach__events = function(list) {
       var list__resultDOM = $(list);
       var playBtn = list__resultDOM.find('.btn-js-play');
       var addBtn = list__resultDOM.find('.btn-js-add');
       var dlBtn = list__resultDOM.find('.btn-js-dl');
       if (list__resultDOM.eq(0).find('.mdl-list__item').length) {
           playBtn.on('click', function(e) {
               e.preventDefault();
               xhr__handler($(this).parents('.mdl-list__item').attr('data-track'), currentProxy, $(this), 'play');
           }), addBtn.on('click', function(e) {
               e.preventDefault();
               xhr__handler($(this).parents('.mdl-list__item').attr('data-track'), currentProxy, $(this), 'add');
           }), dlBtn.on('click', function(e) {
               e.preventDefault();
               dl__handler($(this).parents('.mdl-list__item').attr('data-track'), $(this));
           });
       }
   }


   var dl__handler = function(id, item) {
           var nameThis = $(item).parents('.mdl-list__item').eq(0).find('.name-track').text();
           var data = { message: $(item).data('action') + '..."' + nameThis }
           $.ajax({
               url: currentProxy + id,
               beforeSend: function() {
                   $(".logo").before('<span class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></span>');
                   componentHandler.upgradeDom();
               },
               success: function(res) {
                   var uridl = decodeURI(res.url);
                   $(".logo").prev('span').remove();
                   snackbarContainer.MaterialSnackbar.showSnackbar(data);
                   location.href = uridl + '?referer=songet';
               }
           })
       },
       // Manage state control enable/disable
       ea__handler = function(el, elactive) {
           $(el).is(':checked') ? elactive.show().fadeIn() : elactive.hide().fadeOut();
       },
       // Manage ajax request
       xhr__handler = function(id, proxy, item, type) {
           $.ajax({
               url: proxy + id,
               beforeSend: function() {
                   $(".logo").before('<span class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></span>');
                   componentHandler.upgradeDom();
               },
               success: function(res) {
                   var uridl = decodeURI(res.url);
                   sp__handler(type, item, uridl);
                   $(".logo").prev('span').remove();
               }
           })
       },
       // Manage fns on audio player
       sp__handler = function(type, item, datauri) {
           var nameThis = $(item).parents('.mdl-list__item').eq(0).find('.name-track').text();
           var data = { message: $(item).data('action') + '..."' + nameThis }
           var newvol = parseInt($('.volume').find('.volume__bar').css('height'))/100;
           var __item_play = [
               { 'icon': iconImage, 'title': nameThis, 'file': datauri }
           ];

           if (type == "play") {
               snackbarContainer.MaterialSnackbar.showSnackbar(data);
               AP.destroy();
               AP.init({
                   volume: newvol,
                   playList: __item_play
               });
           }
           if (type == "add") {
               snackbarContainer.MaterialSnackbar.showSnackbar(data);
               AP.update(__item_play);
           }

       },
       // fn search & render music api
       sm__handler = function(qq) {
           var a = "";
           $.ajax({
               url: api__sh,
               data: {
                   part: "snippet",
                   key: api__key,
                   maxResults: "20",
                   order: "relevance",
                   fields: api__fields,
                   q: qq + ", audio"
               },
               beforeSend: function() {
                   $(".list-result").html('<div class="mdl-spinner mdl-js-spinner is-active"></div>');
                   componentHandler.upgradeDom();
               },
               dataType: "json",
               success: function(e) {
                   $.each(e.items, function(e, t) {
                       if ($(t.id).length) {
                           a += '<div class="mdl-list__item" data-track="' + t.id.videoId + '">' +
                               '<a class="mdl-list__item-primary-content btn-js-play" href="#" data-action="Cargando...">' +
                               '<i class="material-icons mdl-list__item-avatar">album</i>' +
                               '<span class="name-track">' + filterWords(t.snippet.title) + '</span></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-play" data-action="Cargando..." href="#">' +
                               '<i class="material-icons">play_arrow</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-add" data-action="Se a&ntilde;adi&oacute; a la lista..." href="#">' +
                               '<i class="material-icons">queue</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-dl btn-js-noty" data-action="Descargando track..." href="#" download="true" target="blank_">' +
                               '<i class="material-icons">file_download</i></a></div>';
                       }
                   }), $(".list-result").html(''), $(".list-result").html(a);
                   componentHandler.upgradeDom();
                   attach__events('.list-result');
               }
           })
       },
       top__tracks = function() {
           var a = "";
           $.ajax({
               url: api__list,
               data: {
                   part: "snippet",
                   key: api__key,
                   maxResults: "10",
                   playlistId: api__listop
               },
               beforeSend: function() {
                   $(".list-top").html('<div class="mdl-spinner mdl-js-spinner is-active"></div>');
                   componentHandler.upgradeDom();
               },
               dataType: "json",
               success: function(e) {
                   $.each(e.items, function(e, t) {
                       if ($(t.snippet).length) {
                           a += '<div class="mdl-list__item" data-track="' + t.snippet.resourceId.videoId + '">' +
                               '<a class="mdl-list__item-primary-content btn-js-play" href="#" data-action="Cargando...">' +
                               '<i class="material-icons sp--1-right">album</i>' +
                               '<span class="name-track" title="' + filterWords(t.snippet.title) + '">' + filterWords(t.snippet.title) + '</span></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-play" data-action="Cargando..." href="#">' +
                               '<i class="material-icons">play_arrow</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-add" data-action="Se a&ntilde;adi&oacute; a la lista..." href="#">' +
                               '<i class="material-icons">queue</i></a>' +
                               '<a class="mdl-button mdl-js-button mdl-button--icon btn-js-dl btn-js-noty" data-action="Descargando track..." href="#" download="true" target="blank_">' +
                               '<i class="material-icons">file_download</i></a></div>';
                       }
                   }), $(".list-top").html(''), $(".list-top").html(a);
                   componentHandler.upgradeDom();
                   attach__events('.list-top');
               }
           })
       },
       // Trim titles song
       filterWords = function(e) {
           var a = /mp3|official|video|new|cover|audio|music|oficial|hq|lyric|([([\]/)|])/gi;
           return e.replace(a, function(e) {
               return e.replace(/./g, "")
           })
       },
       actionbyParams = function(url, action) {
           var url = new URL(url);
           var searchParams = new URLSearchParams(url.search);
           switch (action) {
               case "search":
                   shButtom.focus().val(searchParams.get('t'));
                   sm__handler(searchParams.get('t'));
                   break;
           }
       }