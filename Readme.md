# Glossarizer

* Reads glossary list from json file or object
* Automatically searches for and marks up glossary terms found on a page with <abbr> attributes
* Supports terms exclusion
* Supports multiple terms
* Replaces TextNodes only
* No involvement from authors

## What it is

A small jquery plugin that automatically marks up glossary terms on a page. The glossary terms can be read from an external json file. When users hover over the link (dashed line), they get to see the glossary definition as a tooltip. 

Tooltips are optional, you can use any third-party tooltips. 

## Why use it

If you are writing content that uses specialist vocabulary or many acronyms you need to mark up content with <abbr> tags so that the definitions can show up as a tooltip. But as authors you really should focus on the writing and not on the marking up content. This is where Glossarizer can help. It automatically marks up the glossary terms on a page by reading off a glossary list.

## How to use it

### 1. Prepare your Glossary Data in a JSON File/Object


    [
      {
        "term": "death, !death star",
        "description": "Cessation of all biological functions"
      },
      {
        "term": "genetic, !genetic testing, genes, DNA",
        "description": "relating to genes or heredity: genetic abnormalities."
      },
      {
        "term" : "creature",
        "description" : "A living being, especially an animal"
      },
      {
        "term" : "subdue",
        "description" : "To conquer and subjugate; vanquish"
      },
      {
        "term" : "replenish",
        "description" : "To fill or make complete again; add a new stock or supply to"
      },
      {
        "term" : "whales",
        "description" : "An inlet of the Ross Sea in the Ross Ice Shelf of Antarctica. It has been used as a base for Antarctic expeditions since 1911."
      }
    ]

### 2. Initialize the plugin


    <script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
    <script src="tooltip/tooltip.js"></script>
    <script src="jquery.glossarize.js"></script>
    <script>

    $(function(){

      $('.content').glossarizer({
        sourceURL: 'glossary.json',
        callback: function(){
          
          // Callback fired after glossarizer finishes its job
          
          new tooltip();

        }
      });


    });

    </script>



### Plugin Options


    defaults = {
      sourceURL     : '', /* URL of the JSON file with format {"term": "", "description": ""} */
      termData      : '', /* Use Either sourceURL or termData: */
      replaceTag    : 'abbr', /* Matching words will be wrapped with abbr tags by default */
      lookupTagName : 'p, ul', /* Lookup in either paragraphs or lists. Do not replace in headings */
      callback      : null, /* Callback once all tags are replaced: Call or tooltip or anything you like */
      replaceOnce   : true /* Replace only once in a TextNode */
    }
