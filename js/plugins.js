"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */
// usage: log('inside coolFunc', this, arguments);
/** @license paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/ */
window.log = function f() {
  log.history = log.history || [];log.history.push(arguments);if (this.console) {
    var args = arguments,
        newarr;args.callee = args.callee.caller;newarr = [].slice.call(args);if (_typeof(console.log) === 'object') log.apply.call(console.log, console, newarr);else console.log.apply(console, newarr);
  }
};

// make it safe to use console.log always
(function (a) {
  function b() {}for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {
    a[d] = a[d] || b;
  }
})(function () {
  try {
    console.log();return window.console;
  } catch (a) {
    return window.console = {};
  }
}());
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {

    /**
    * Creates a Quote instance.
    * 
    * @class Quote
    * @constructor
    * @param {Element} sourceElement - The HTML element on which to base the Quote.
    * @param {Object} [options] - The options.
    * @param {String} [options.ellipsisCssClass='quoteify-ellipsis'] - The css class for the ellipsis.
    * @param {Boolean} [options.expanded=false] - Whether the quote is initially expanded or not.
    * @param {Number} [options.minWordCount=15] - The minimum number of words to display when the quote is collapsed.
    * @param {String} [options.readMoreLessCssClass='quoteify-more-less'] - The css class for the container that holds the "Read More" and "Read Less" actions.
    * @param {String} [options.readMoreCssClass='quoteify-more'] - The css class for the "Read More" action.
    * @param {String} [options.readLessCssClass='quoteify-less'] - The css class for the "Read Less" action.
    * @param {String} [options.readMoreText='Read More'] - The text of the "Read More" action.
    * @param {String} [options.readLessText='Read Less'] - The text of the "Read Less" action.
    */
    var Quote = function () {
        function Quote(sourceElement) {
            var _this = this;

            var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                _ref$ellipsisCssClass = _ref.ellipsisCssClass,
                ellipsisCssClass = _ref$ellipsisCssClass === undefined ? 'quoteify-ellipsis' : _ref$ellipsisCssClass,
                _ref$expanded = _ref.expanded,
                expanded = _ref$expanded === undefined ? false : _ref$expanded,
                _ref$minWordCount = _ref.minWordCount,
                minWordCount = _ref$minWordCount === undefined ? 15 : _ref$minWordCount,
                _ref$readMoreLessCssC = _ref.readMoreLessCssClass,
                readMoreLessCssClass = _ref$readMoreLessCssC === undefined ? 'quoteify-more-less' : _ref$readMoreLessCssC,
                _ref$readMoreCssClass = _ref.readMoreCssClass,
                readMoreCssClass = _ref$readMoreCssClass === undefined ? 'quoteify-more' : _ref$readMoreCssClass,
                _ref$readLessCssClass = _ref.readLessCssClass,
                readLessCssClass = _ref$readLessCssClass === undefined ? 'quoteify-less' : _ref$readLessCssClass,
                _ref$readMoreText = _ref.readMoreText,
                readMoreText = _ref$readMoreText === undefined ? 'Read More' : _ref$readMoreText,
                _ref$readLessText = _ref.readLessText,
                readLessText = _ref$readLessText === undefined ? 'Read Less' : _ref$readLessText;

            _classCallCheck(this, Quote);

            var $sourceElement = $(sourceElement);

            /**
            * @property {Number} - The minimum number of words to display when the quote is collapsed.
            * @default 15
            */
            this.minWordCount = minWordCount;

            /**
            * @property {Array} - An array of words comprising the quote's text.
            */
            this.words = this._getWords($sourceElement);

            /**
            * @property {Boolean} - Whether the quote is above the word threshold or not.
            */
            this.aboveWordThreshold = this.words.length > this.minWordCount;

            /**
            * @property {String} - The HTML for the base text to display when the quote is collapsed.
            */
            this.baseText = this._getBaseText(this.words, minWordCount);

            /**
            * @property {String} - The HTML for the additional text to display when the quote is expanded.
            */
            this.moreText = this._getMoreText(this.words, minWordCount);

            /**
            * @property {String} - The HTML for the quote's source.
            */
            this.source = this._getSource($sourceElement);

            /**
            * @property {Element} - The quote's element.
            */
            // Clone source element to preserve any attributes it may have
            this.el = this.aboveWordThreshold ? $sourceElement.clone().empty()[0] : sourceElement;

            /**
            * @property {jQuery} - The jQuery object containing the quote's element.
            */
            this.$el = $(this.el);

            /**
            * @property {String} - The css class for the ellipsis.
            * @default 'quoteify-ellipsis'
            */
            this.ellipsisCssClass = ellipsisCssClass;

            /**
            * @property {Boolean} - Whether the quote is expanded or not.
            * @default false
            */
            this.expanded = this.aboveWordThreshold ? expanded : true;

            /**
            * @property {String} - The css class for the additional text to display when the quote is expanded.
            */
            this.moreTextCssClass = 'quoteify-more-text';

            /**
            * @property {String} - The css class for the container that holds the "Read More" and "Read Less" actions.
            */
            this.readMoreLessCssClass = readMoreLessCssClass;

            /**
            * @property {String} - The css class for the "Read More" action.
            */
            this.readMoreCssClass = readMoreCssClass;

            /**
            * @property {String} - The css class for the "Read Less" action.
            */
            this.readLessCssClass = readLessCssClass;

            /**
            * @property {String} - The text of the "Read More" action.
            */
            this.readMoreText = readMoreText;

            /**
            * @property {String} - The text of the "Read Less" action.
            */
            this.readLessText = readLessText;

            /**
            * @property {jQuery} - The jQuery object containing the ellipsis element.
            */
            this.$ellipsis = null;

            /**
            * @property {jQuery} - The jQuery object containing the additional text element.
            */
            this.$moreText = null;

            /**
            * @property {jQuery} - The jQuery object containing the "Read More" element.
            */
            this.$readMore = null;

            /**
            * @property {jQuery} - The jQuery object containing the "Read Less" element.
            */
            this.$readLess = null;

            if (this.aboveWordThreshold) {
                // Initialize events
                this.$el.on('click', '.' + this.readMoreCssClass, function () {
                    _this.show();
                });
                this.$el.on('click', '.' + this.readLessCssClass, function () {
                    _this.hide();
                });

                // Store this instance for future access
                this.$el.data('quoteify', this);
            }
        }

        /**
        * Renders the quote.
        *
        * @returns {this} self
        */


        Quote.prototype.render = function render() {
            if (this.aboveWordThreshold) {
                this.$el.html(this.baseText + '<span class="' + this.moreTextCssClass + '">' + this.moreText + '</span>' + '<span class="' + this.ellipsisCssClass + '" aria-hidden="true">' + '&hellip;' + '</span>' + this.source + '<div class="' + this.readMoreLessCssClass + '" aria-hidden="true">' + '<span class="' + this.readMoreCssClass + '">' + this.readMoreText + '</span>' + '<span class="' + this.readLessCssClass + '">' + this.readLessText + '</span>' + '</div>');

                this.$ellipsis = this.$el.find('.' + this.ellipsisCssClass);
                this.$moreText = this.$el.find('.' + this.moreTextCssClass);
                this.$readMore = this.$el.find('.' + this.readMoreCssClass);
                this.$readLess = this.$el.find('.' + this.readLessCssClass);
                this.update();
            }

            return this;
        };

        /**
        * Updates the quote's display.
        *
        * @returns {this} self
        */


        Quote.prototype.update = function update() {
            if (!this.expanded) {
                this.$ellipsis.show();
                this.$moreText.hide();
                this.$readMore.show();
                this.$readLess.hide();
            } else {
                this.$ellipsis.hide();
                this.$moreText.show();
                this.$readMore.hide();
                this.$readLess.show();
            }

            return this;
        };

        /**
        * Setter for whether the quote is expanded or not.
        *
        * @param {Boolean} value - Whether the quote is expanded or not.
        * @returns {this} self
        */
        // Avoid ES5 or ES6 setter syntax for IE8 compatibility


        Quote.prototype.setExpanded = function setExpanded(value) {
            if (value !== this.expanded) {
                this.expanded = value;
                this._onExpandedChange();
            }

            return this;
        };

        /**
        * Expands the quote.
        *
        * @returns {this} self
        */


        Quote.prototype.show = function show() {
            this.setExpanded(true);

            return this;
        };

        /**
        * Collapses the quote.
        *
        * @returns {this} self
        */


        Quote.prototype.hide = function hide() {
            this.setExpanded(false);

            return this;
        };

        /**
        * Gets the words/text from a source element.
        *
        * @private
        * @param {jQuery} $el - The jQuery object containing the source element.
        * @returns {Array} An array of words comprising the text.
        */


        Quote.prototype._getWords = function _getWords($el) {
            var text = $el.contents()[0].nodeValue;

            return text.substring(0, text.lastIndexOf('"') + 1).split(' ');
        };

        /**
        * Gets the base text to display when the quote is collapsed.
        *
        * @private
        * @param {Array} text - The text array.
        * @param {Number} numWords - The number of words to include in the base text.
        * @returns {String} The base text.
        */


        Quote.prototype._getBaseText = function _getBaseText(text, numWords) {
            return text.slice(0, numWords).join(' ');
        };

        /**
        * Gets the HTML of the additional text to display when the quote is expanded.
        *
        * @private
        * @param {Array} text - The text array.
        * @param {Number} numWords - The number of words to skip. Those words are included in the base text.
        * @returns {String} The HTML of the additional text.
        */


        Quote.prototype._getMoreText = function _getMoreText(text, numWords) {
            return ' ' + text.slice(numWords).join(' ');
        };

        /**
        * Gets the HTML of the quote's source.
        *
        * @private
        * @param {jQuery} $el - The jQuery object containing the source element.
        * @returns {String} The HTML of the quote's source.
        */


        Quote.prototype._getSource = function _getSource($el) {
            var text = $el.contents()[0].nodeValue;
            var link = $($el.contents()[1]).clone();

            return $('<div></div>').append(text.substring(text.lastIndexOf('"') + 1)).append(link).html();
        };

        /**
        * The handler to execute when the quote's "expanded" state is changed.
        *
        * @private
        * @returns {this} self
        */


        Quote.prototype._onExpandedChange = function _onExpandedChange() {
            this.update();

            return this;
        };

        return Quote;
    }();

    $.fn.quoteify = function (options) {
        // Loop through each quote container
        this.each(function () {
            var $this = $(this);
            var quotes = $this.find('li');
            var html = $();

            quotes.each(function () {
                var quote = new Quote(this, options);
                html = html.add(quote.render().$el);
            });

            // Update DOM once for performance
            $this.html(html);
        });

        return this;
    };
})(jQuery);
