// FRBR Display Improvements
// Created by: Jeremy Prevost, Northwestern University
// Version 1.02
/* jshint strict: true */
$(document).ready(function () {
  "use strict";
  $('.EXLResult').each(function () {
      var frbr = $(this).find('.EXLResultFRBR').length;
      if (frbr !== 0) {
          $(this).find('.EXLTabsRibbon').hide();
          $(this).find('.EXLResultTitle').find('a').removeAttr('href');
          $(this).find('.EXLResultFourthLine').hide();
          $(this).find('.EXLResultAvailability').hide();
          var link = $(this).find('.EXLBriefResultsDisplayMultipleLink');
          $(this).find('.EXLSummaryFields').append(link);
          var titlelink = $(this).find('.EXLResultTitle').find('a');
          titlelink.attr('href', link.attr('href'));
          titlelink.attr('target', '_parent');
          var thumblink = $(this).find('.EXLThumbnail .EXLBriefResultsDisplayCoverImage A');
          thumblink.attr('href', link.attr('href'));
          $(this).find('.EXLMyShelfStar A').hide();
          $(this).find('.EXLResultFRBR').hide();
          $(this).find('.EXLThumbnail').find('.EXLThumbnailCaption').hide();
          $(this).find('.EXLThumbnail').find('.EXLBriefResultsDisplayCoverImages').hide();
      }
  });
  function gup(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regexS = '[\\?&]' + name + '=([^&#]*)';
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.href);
      if (results === null)
          return '';
      else
          return results[1];
  }
  $('.EXLBriefResultsDisplayMultipleLink').each(function () {
      var TheURL = $(this).attr('href');
      var URLsplit = TheURL.split('?');
      var template = URLsplit[0];
      var querystring = URLsplit[1];
      var sort = '?srt=Relevance&';
      var currentsort = $('.EXLResultsSortBySelected:first').text();
      var origsort = gup('origsort');
      var sortedURL = template + sort + querystring + '&origsort=' + currentsort;
      $(this).attr('href', sortedURL);
  });
  $('.EXLSearchRefinementRemovefacet_frbrgroupid').each(function () {
      var TheURL = $(this).attr('href');
      var URLsplit = TheURL.split('?');
      var template = URLsplit[0];
      var querystring = URLsplit[1];
      var sort = '?srt=Relevance&';
      var currentsort = $('.EXLResultsSortBySelected:first').text();
      var origsort = gup('origsort');
      var URLsort = gup('srt');
      var origsortcleaner = '&origsort=' + origsort;
      TheURL = TheURL.replace(origsortcleaner, '');
      $(this).attr('href', TheURL);
      if (currentsort != origsort) {
          var URLsortcleaner = 'srt=' + URLsort;
          if (origsort == 'relevance') {
              TheURL = TheURL.replace(URLsortcleaner, 'srt=rank');
              document.getElementById('str').value = origsort;
          } else if (origsort == 'date') {
              TheURL = TheURL.replace(URLsortcleaner, 'srt=date');
          } else if (origsort == 'popularity') {
              TheURL = TheURL.replace(URLsortcleaner, 'srt=popularity');
              document.getElementById('str').value = origsort;
          } else if (origsort == 'author') {
              TheURL = TheURL.replace(URLsortcleaner, 'srt=author');
              document.getElementById('str').value = origsort;
          } else if (origsort == 'title') {
              TheURL = TheURL.replace(URLsortcleaner, 'srt=title');
              document.getElementById('str').value = origsort;
          }
          $(this).attr('href', TheURL);
      }
  });
});
