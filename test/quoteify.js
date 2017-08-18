import { before, beforeEach, describe, it } from 'mocha';
import { expect }  from 'chai';
import jsdom       from 'jsdom-global';
import sinon       from 'sinon';
    
describe('Quoteify:', () => {
    let jQuery = null;
    let $ = null;
    
    let longQuote = null;
    let $longQuote = null;
    let $longQuoteMoreText = null;
    let $longQuoteEllipsis = null;
    let $longQuoteMore = null;
    let $longQuoteLess = null;
    let longQuoteOriginalContent = null;
    
    let $shortQuote = null;
    let shortQuoteOriginalContent = null;
    
    let customQuote = null;
    let $customQuote = null;
    
    let onExpandedChangeSpy = null;
    
    let emitEvent = (type, el) => {
        let e = document.createEvent('Event');
        e.initEvent(type, true, true);
        (el instanceof jQuery) ? el[0].dispatchEvent(e) : el.dispatchEvent(e);        
        return e;
    };
    
    jsdom();
    
    before('set up jsdom dependencies', () => {
        require('../src/scripts/libs/jquery-1.7.1.min.js');
        global.jQuery = global.$ = jQuery = $ = window.jQuery;
        require('../src/scripts/plugins/quoteify.js')
    })
    
    beforeEach('test setup', () => {
        document.body.innerHTML = '<ul class="quotes">' + 
            '<li id="long">"The ride is good on smooth pavement, acceptable on rough pavement, and downright punishing on potholed roads, with little difference noted in 2WD and 4WD models, and Access and Double Cabs." -- <a href="http://www.automobilemag.com/reviews/driven/1508-2016-toyota-tacoma-review/">Automobile Magazine</a></li>' +
                '<li id="short">"Regardless of those drums, the braking power felt acceptable on our drive." -- <a href="http://autoweek.com/article/car-reviews/2016-toyota-tacoma-first-drive">AutoWeek</a></li>' + 
            '</ul>' +
            '<ul class="custom-quotes">' + 
                '<li id="custom">"The ride is good on smooth pavement, acceptable on rough pavement, and downright punishing on potholed roads, with little difference noted in 2WD and 4WD models, and Access and Double Cabs." -- <a href="http://www.automobilemag.com/reviews/driven/1508-2016-toyota-tacoma-review/">Automobile Magazine</a></li>'
            '</ul>';
        
        longQuoteOriginalContent = $('#long').html();
        shortQuoteOriginalContent = $('#short').html();
        
        // Default quoteify
        $('.quotes').quoteify();
        
        $longQuote = $('#long');
        longQuote = $longQuote.data('quoteify');
        $longQuoteMoreText = $longQuote.find('.quoteify-more-text');
        $longQuoteEllipsis = $longQuote.find('.quoteify-ellipsis');
        $longQuoteMore = $longQuote.find('.quoteify-more');
        $longQuoteLess = $longQuote.find('.quoteify-less');
        $shortQuote = $('#short');
        onExpandedChangeSpy = sinon.spy(longQuote, '_onExpandedChange');
        
        // Custom quoteify
        $('.custom-quotes').quoteify({
            ellipsisCssClass: 'custom-ellipsis',
            expanded: true,
            minWordCount: 10,
            readMoreLessCssClass: 'custom-more-less',
            readMoreCssClass: 'custom-more',
            readLessCssClass: 'custom-less',
            readMoreText: 'Custom More',
            readLessText: 'Custom Less'
        });
        
        $customQuote = $('#custom');
        customQuote = $customQuote.data('quoteify');
    });

    describe('when quoteifying a quote', () => {
        it('should have the correct defaults', () => {
            expect(longQuote.ellipsisCssClass).to.equal('quoteify-ellipsis');
            expect(longQuote.expanded).to.be.false;
            expect(longQuote.minWordCount).to.equal(15);
            expect(longQuote.readMoreLessCssClass).to.equal('quoteify-more-less');
            expect(longQuote.readMoreCssClass).to.equal('quoteify-more');
            expect(longQuote.readLessCssClass).to.equal('quoteify-less');
            expect(longQuote.readMoreText).to.equal('Read More');
            expect(longQuote.readLessText).to.equal('Read Less');
        });
    });
    
    describe('when quoteifying a quote with custom options', () => {
        it('should be correctly customized', () => {
            expect(customQuote.ellipsisCssClass).to.equal('custom-ellipsis');
            expect(customQuote.expanded).to.be.true;
            expect(customQuote.minWordCount).to.equal(10);
            expect(customQuote.readMoreLessCssClass).to.equal('custom-more-less');
            expect(customQuote.readMoreCssClass).to.equal('custom-more');
            expect(customQuote.readLessCssClass).to.equal('custom-less');
            expect(customQuote.readMoreText).to.equal('Custom More');
            expect(customQuote.readLessText).to.equal('Custom Less');
        });
    });
    
    describe('when quoteifying a long quote', () => {
        it('should be collapsed', () => {
            expect(longQuote.expanded).to.be.false;
        });
        
        it('should preserve the original quote content', () => {
            expect(longQuote.baseText + longQuote.moreText + longQuote.source).to.equal(longQuoteOriginalContent);
        });
        
        it('should truncate the number of words initially displayed', () => {
            expect(longQuote.baseText).to.equal('"The ride is good on smooth pavement, acceptable on rough pavement, and downright punishing on');
        });
        
        it('should display an ellipsis at the end of the truncated quote', () => {
            expect($longQuoteEllipsis.css('display')).to.equal('');
        });
        
        it('should display the "Read More" action', () => {
            expect($longQuoteMore.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should not display the "Read Less" action', () => {
            expect($longQuoteLess.css('display')).to.equal('none');
        });
    });
    
    describe('when quoteifying a short quote', () => {
        it('should be identical to the original quote', () => {
            expect($shortQuote.html()).to.equal(shortQuoteOriginalContent);
        });
    });

    describe('when expanding a quote', () => {
        it('should display the full text of the quote', () => {
            longQuote.show();
            expect($longQuoteMoreText.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should hide the ellipsis at the end of the quote', () => {
            longQuote.show();
            expect($longQuoteEllipsis.css('display')).to.equal('none');
        });
        
        it('should hide the "Read More" action', () => {
            longQuote.show();
            expect($longQuoteMore.css('display')).to.equal('none');
        });
        
        it('should display the "Read Less" action', () => {
            longQuote.show();
            expect($longQuoteLess.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
    });
    
    describe('clicking "Read More" to expand a quote', () => {
        it('should display the full text of the quote', () => {
            emitEvent('click', $longQuoteMore);
            expect($longQuoteMoreText.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should hide the ellipsis at the end of the quote', () => {
            emitEvent('click', $longQuoteMore);
            expect($longQuoteEllipsis.css('display')).to.equal('none');
        });
        
        it('should hide the "Read More" action', () => {
            emitEvent('click', $longQuoteMore);
            expect($longQuoteMore.css('display')).to.equal('none');
        });
        
        it('should display the "Read Less" action', () => {
            emitEvent('click', $longQuoteMore);
            expect($longQuoteLess.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
    });

    describe('when collapsing a quote', () => {
        it('should hide the additional text of the quote', () => {
            longQuote.show();
            longQuote.hide();
            expect($longQuoteMoreText.css('display')).to.equal('none');
        });
        
        it('should display the ellipsis at the end of the quote', () => {
            longQuote.show();
            longQuote.hide();
            expect($longQuoteEllipsis.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should show the "Read More" action', () => {
            longQuote.show();
            longQuote.hide();
            expect($longQuoteMore.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should hide the "Read Less" action', () => {
            longQuote.show();
            longQuote.hide();
            expect($longQuoteLess.css('display')).to.equal('none');
        });
    });
    
    describe('clicking "Read Less" to collapse a quote', () => {
        it('should hide the additional text of the quote', () => {
            emitEvent('click', $longQuoteMore);
            emitEvent('click', $longQuoteLess);
            expect($longQuoteMoreText.css('display')).to.equal('none');
        });
        
        it('should display the ellipsis at the end of the quote', () => {
            emitEvent('click', $longQuoteMore);
            emitEvent('click', $longQuoteLess);
            expect($longQuoteEllipsis.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should show the "Read More" action', () => {
            emitEvent('click', $longQuoteMore);
            emitEvent('click', $longQuoteLess);
            expect($longQuoteMore.css('display')).to.satisfy((value) => (value === '' || value === 'inline'));
        });
        
        it('should hide the "Read Less" action', () => {
            emitEvent('click', $longQuoteMore);
            emitEvent('click', $longQuoteLess);
            expect($longQuoteLess.css('display')).to.equal('none');
        });
    });
    
    describe('when changing the "expanded" property', () => {
        it('should execute "onExpandedChange" if value was changed', () => {
            longQuote.setExpanded(true);
            expect(onExpandedChangeSpy.callCount).to.equal(1);
        });
        
        it('should not execute "onExpandedChange" if value was not changed', () => {
            longQuote.setExpanded(false);
            expect(onExpandedChangeSpy.callCount).to.equal(0);
        });
    });
});