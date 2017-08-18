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
class Quote {
    constructor (sourceElement, {
        ellipsisCssClass = 'quoteify-ellipsis',
        expanded = false,
        minWordCount = 15,
        readMoreLessCssClass = 'quoteify-more-less',
        readMoreCssClass = 'quoteify-more',
        readLessCssClass = 'quoteify-less',
        readMoreText = 'Read More',
        readLessText = 'Read Less'
    } = {}) {
        const $sourceElement = $(sourceElement);

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
        this.expanded = (this.aboveWordThreshold) ? expanded : true;
        
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
            this.$el.on('click', '.' + this.readMoreCssClass, () => { this.show(); });
            this.$el.on('click', '.' + this.readLessCssClass, () => { this.hide(); });
            
            // Store this instance for future access
            this.$el.data('quoteify', this);
        }
    }

    /**
    * Renders the quote.
    *
    * @returns {this} self
    */
    render () {
        if (this.aboveWordThreshold) {
            this.$el.html(
                this.baseText + 
                '<span class="' + this.moreTextCssClass + '">' + this.moreText + '</span>' + 
                '<span class="' + this.ellipsisCssClass + '" aria-hidden="true">' + '&hellip;' + '</span>' +
                this.source + 
                '<div class="' + this.readMoreLessCssClass + '" aria-hidden="true">' + 
                    '<span class="' + this.readMoreCssClass + '">' + this.readMoreText + '</span>' +
                    '<span class="' + this.readLessCssClass + '">' + this.readLessText + '</span>' +
                '</div>'
            );

            this.$ellipsis = this.$el.find('.' + this.ellipsisCssClass);
            this.$moreText = this.$el.find('.' + this.moreTextCssClass);
            this.$readMore = this.$el.find('.' + this.readMoreCssClass);
            this.$readLess = this.$el.find('.' + this.readLessCssClass);
            this.update();
        }
        
        return this;
    }

    /**
    * Updates the quote's display.
    *
    * @returns {this} self
    */
    update () {
        if (!this.expanded) {
            this.$ellipsis.show();
            this.$moreText.hide();
            this.$readMore.show();
            this.$readLess.hide();
        }
        else {
            this.$ellipsis.hide();
            this.$moreText.show();
            this.$readMore.hide();
            this.$readLess.show();
        }
        
        return this;
    }

    /**
    * Setter for whether the quote is expanded or not.
    *
    * @param {Boolean} value - Whether the quote is expanded or not.
    * @returns {this} self
    */
    // Avoid ES5 or ES6 setter syntax for IE8 compatibility
    setExpanded (value) {
        if (value !== this.expanded) {
            this.expanded = value;
            this._onExpandedChange();
        }
        
        return this;
    }

    /**
    * Expands the quote.
    *
    * @returns {this} self
    */
    show () {
        this.setExpanded(true);
        
        return this;
    }

    /**
    * Collapses the quote.
    *
    * @returns {this} self
    */
    hide () {
        this.setExpanded(false);
        
        return this;
    }

    /**
    * Gets the words/text from a source element.
    *
    * @private
    * @param {jQuery} $el - The jQuery object containing the source element.
    * @returns {Array} An array of words comprising the text.
    */
    _getWords ($el) {
        const text = $el.contents()[0].nodeValue;

        return text.substring(0, text.lastIndexOf('"') + 1).split(' ');
    }

    /**
    * Gets the base text to display when the quote is collapsed.
    *
    * @private
    * @param {Array} text - The text array.
    * @param {Number} numWords - The number of words to include in the base text.
    * @returns {String} The base text.
    */
    _getBaseText (text, numWords) {
        return text.slice(0, numWords).join(' ');
    }

    /**
    * Gets the HTML of the additional text to display when the quote is expanded.
    *
    * @private
    * @param {Array} text - The text array.
    * @param {Number} numWords - The number of words to skip. Those words are included in the base text.
    * @returns {String} The HTML of the additional text.
    */
    _getMoreText (text, numWords) {
        return ' ' + text.slice(numWords).join(' ');
    }

    /**
    * Gets the HTML of the quote's source.
    *
    * @private
    * @param {jQuery} $el - The jQuery object containing the source element.
    * @returns {String} The HTML of the quote's source.
    */
    _getSource ($el) {
        const text = $el.contents()[0].nodeValue;
        const link = $($el.contents()[1]).clone();

        return $('<div></div>').append(text.substring(text.lastIndexOf('"') + 1)).append(link).html();
    }

    /**
    * The handler to execute when the quote's "expanded" state is changed.
    *
    * @private
    * @returns {this} self
    */
    _onExpandedChange () {
        this.update();
        
        return this;
    }
}

$.fn.quoteify = function(options) {
    // Loop through each quote container
    this.each(function () {
        const $this = $(this);
        const quotes = $this.find('li');
        let html = $();
        
        quotes.each(function () {
            const quote = new Quote(this, options);
            html = html.add(quote.render().$el);
        });
        
       // Update DOM once for performance
        $this.html(html); 
    });

    return this;
};
    
}(jQuery));