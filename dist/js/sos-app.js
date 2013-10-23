/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

$( document ).ready(function() {
  var scholarOneSearch = (function(){
    "use strict";

    //build report a problem links;
    var reportAProblem = function(){
      var $results = $('#exlidResultsTable tr.EXLResult');
      $results.each(function(){
        var title = $(this).find('h2.EXLResultTitle').text().trim();
        var id = $(this).find('a.EXLResultRecordId').attr('id');
        //The Document ID
        var titleStr = title + ' (' + id + ')';

        var url = 'http://library.northeastern.edu/get-help/tech-support/report-a-problem?resource=' + encodeURIComponent(titleStr);

        var $link = $('<li><a class="report-a-problem  btn btn-small btn-link" href="' + url + '" title="Report a problem." target="_blank"><i class="icon-comments-alt"></a><li>');
        $(this).find('ul.EXLResultTabs').append($link);
      });
      $('a.report-a-problem').tooltip();
    };

    //move the a-to-z link item to the search bar.
    //buildNavBarNav();
    //
    var buildFacetCollapse = function(){
      var i = 1;

      //Creating a collapse group.
      $('#facetList > .EXLFacetContainer').each(function(i){
        //find out if we should add the collapse
        var hasAdditionalFacetes = $(this).find("ol.EXLFacetsList > li").hasClass("EXLAdditionalFacet");

        if( i > 0 && hasAdditionalFacetes ){
            //refactor this code to to wrap the li item instead>
            $(this).find('li.EXLFacetsDisplayMore').addClass('EXLAdditionalFacet');
            var $target = $(this).find('h4');
            var $link = $('<a href="#expandFacet'+ (i + 1) +'" title="Expand ' + $target.text() +' list" class="facet-heading facet-expand"/>');
            var $icon = $('<i class="icon-expand-alt icon-large pull-right"/>');
            $link.click(function(){
              $(this).parents('.EXLFacetContainer').find('li.EXLFacet, li.EXLFacetsDisplayMore').toggleClass('EXLAdditionalFacet');
              $(this).find('i').toggleClass('icon-expand-alt').toggleClass('icon-collapse-alt');
              $(this).toggleClass('collapsed-facet');
                if( $(this).hasClass('collapsed-facet')){
                  $(this).tooltip('destroy').attr('title',  'Collapse '+ $target.text() +' list' ).tooltip();
                }
                else{
                  $(this).tooltip('destroy').attr('title',  'Expand '+ $target.text() +' list' ).tooltip();
                }

            });

            $target.addClass("list-group-item-heading").wrap($link).append($icon);
            $(this).find('a.facet-heading.facet-expand').wrap('<li class="EXLFacetHeader"/>').tooltip();
            $(this).find('ol.EXLFacetsList').prepend($(this).find('li.list-group-item'));
        }
      });

      $('li.EXLFacetsDisplayMore').find('a').html('Show more options<i class="icon-gear icon-large pull-right"/>').attr({
          title: "Refine your search more."
      }).tooltip();
    };

    var  eShelfIcons = function(){
      $('img[alt="Add to e-Shelf"]').after('<i class="icon-bookmark-empty icon-large"></i>').hide();
      $('img[alt="In e-Shelf"]').after('<i class="icon-bookmark icon-large"></i>').hide();
      $('td.EXLMyShelfStar > a').addClass('btn btn-success btn-small').click(function(){
        if ($(this).data('original-title') === "In e-Shelf"){
            $(this).tooltip('destroy').attr('title','Add to e-Shelf').tooltip({title:'Add to e-Shelf'});
        }
        else{
          $(this).tooltip('destroy').attr('title',"In e-Shelf").tooltip({title:'In e-Shelf'});
        }
        var $i  = $(this).children("i");
        if ($i.hasClass('icon-bookmark-empty')){
          $i.removeClass('icon-bookmark-empty').addClass('icon-bookmark');
        }
        else{
          $i.removeClass('icon-bookmark').addClass('icon-bookmark-empty');
        }
      }).tooltip();
    };



    //Javascript to develop/test worldcat search link in primo
    //Robin Schaaf, 1/9/2013
    //University of Notre Dame Hesburgh Libraries


    var worldCatLinks = function(){
      var worldCatBaseUrl = "http://northeastern.worldcat.org/search?q=" ;

      function getWCIndex(exSearch){
        switch (exSearch){
        case 'any':
          return 'kw';
        case 'title':
          return 'ti';
        case 'creator':
          return 'au';
        case 'sub':
          return 'su';
        case 'isbn':
          return 'bn';
        case 'issn':
          return 'n2';
        case 'lsr03':
          return 'se';
        case 'lsr04':
          return 'ut';
        case 'lsr06':
          return 'pb';
        case 'lsr05':
          return 'lc';
        default:
          return 'kw';
        }

      }

      //declaring the variables before if/else
      var $link;
      var searchString = '';
      var searchTerm = '';
      if ($('#exlidAdvancedSearchRibbon').length && !$('#exlidAdvancedSearchRibbon').hasClass('EXLAdvancedBrowseRibbon')){




        //loop through each advanced search row
        $('.EXLAdvancedSearchFormRow').each(function(index) {
          //as long as free text is entered
          if( ($('#input_freeText' + index).length) && ($('#input_freeText' + index).val() !== '')){
            //the dropdowns start with 1
            var ddIndex = index + 1;
            //convert the search type from what's in the dropdown
            //to worldcat's term
            var wcIndex = getWCIndex($('#exlidInput_scope_' + ddIndex).val());

            //for 'constains'search
            var operator = '%3A';
            //for 'exact' search
            if ($('#exlidInput_precisionOperator_' + ddIndex).val() == 'exact'){
              operator = '%3D';
            }

            //construct search string
            searchString += wcIndex + operator + $('#input_freeText' + index).val() + ' ';
          }
        });


        //also language search
        if ($('#exlidInput_language_').val() != 'all_items'){
          searchString += 'ln' + '%3A' + $('#exlidInput_language_').val() + ' ';
        }



        if (searchString !== ''){
          //replace space with +
          searchString = searchString.replace(/ /g, '+');

          //remove last "+"
          searchString = searchString.substring(0,searchString.length-1);

          //escape quotes
          searchString = searchString.replace(/\"/g, '&quot;');
          searchString = searchString.replace(/\'/g, "\\'");

          $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchString + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for more results.">Search <img src="../customized/NUdev/images/worldcat-logo.png" width="22" height="22" alt=" "> WorldCat</a>').tooltip();
          //add the worldcat link
          $('.EXLSearchFieldRibbonFormLinks').append($link);
        }

      }
      else if ( $('#search_field').val().length > 0 && typeof jQuery !== 'undefined'){
          searchTerm = $('#search_field').val();

          //escape quotes
          searchTerm = searchTerm.replace(/\"/g, '&quot;');
          searchTerm = searchTerm.replace(/\'/g, "\\'");
          $link = $('<a onclick="javascript:window.open(\''+ worldCatBaseUrl + searchTerm + '\');" href="javascript:void(0);" class="navbar-link" title="Search WorldCat for ' + searchTerm + '">Search <img src="../customized/NUdev/images/worldcat-logo.png" width="22" height="22" alt=" "> WorldCat</a>').tooltip();

          //add the worldcat links
          $('.EXLSearchFieldRibbonAdvancedSearchLink').before($link);
          $link.wrap('<div class="EXLSearchFieldRibbonAdvancedSearchLink"/>');

      }
      else{
        return;
      }
    };



    var buildIcons = function(){
      $('a.EXLBriefResultsPaginationLinkNext').find('img').after('<i class="icon-circle-arrow-right"></i>');
      $('a.EXLBriefResultsPaginationLinkPrevious').find('img').after('<i class="icon-circle-arrow-left"></i>');

      //adding an icon before the RSS link;
      $('form[name="rssForm"]').prepend('<i class="icon-rss"></i>');
      $('.EXLFacetSaveSearchAction > a').before('<i class="icon-save"/>');
      $('.EXLFacetSaveToEShelfAction > a').before('<i class="icon-bookmark"/>');
      $('img[src="../images/icon_popout_tab.png"]').hide().after('<i class="icon-external-link"></i>');

      // $('a.EXLFirstRefinementElement').find('#removeFacet').hide().before('<i class="icon-remove-circle close"/>');
      $('img[src="../images/folders_close_inpage.gif"]').hide().before('<i class="icon-folder-close"></i>');
      $('img[src="../images/folders_open.gif"]').hide().before('<i class="icon-folder-open"></i>');
    };

    var addToolTips = function(){
      $("a#showMoreOptions, a.EXLSearchFieldRibbonAdvancedTwoLinks").tooltip();
    };


    var addActiveStates = function(){
      var $activeStatesTargets = $('.EXLFindDBListHeaderAtoZSelected > a');
      $activeStatesTargets.addClass('active');
    };

    //handle the radio clicks of the dropdown menus on Primo

    var handleRadio = function(){
      var $radios = $('#scopesListContainer').find('input[type="radio"]');
      $radios.click(function(){
        $radios.removeAttr('checked');
      });
    };

    // Build the draggable handle.
    var draggable = function(){
      $('#draggable').html('<i class="icon-resize-vertical"></i>').find('img').hide();
      $('#demoLibId').before($('#draggable'));
    };

    var handleMediaQuerySuport = function(){
      if(!Modernizr.mediaqueries){
        alertOutdatedBrowser();
      }

      Modernizr.load({
        test: Modernizr.mediaqueries,
        nope: ['../customized/NUdev/js/respond.min.js']
      });
    };

    var alertOutdatedBrowser = function(){
      $('#exlidHeaderSystemFeedback').append('<div class="alert alert-danger"><strong>You\'re Using an Outdated Web Browser</strong><br>In order to experience this website properly, please upgrade. Learn more at <a href="http://wiserbrowser.com">www.wiserbrowser.com</a></div>');
    }

    //Build the page functions.
    var init = function(){
      $('#search_field').attr('placeholder','Search...');
      draggable();
      eShelfIcons();
      buildFacetCollapse();
      reportAProblem();
      buildIcons();
      addActiveStates();
      handleRadio();
      addToolTips();
      handleMediaQuerySuport();
    };

    return {
      init: init,
      worldCatLinks: worldCatLinks
    };
  })();
  scholarOneSearch.init();
  scholarOneSearch.worldCatLinks();
});



