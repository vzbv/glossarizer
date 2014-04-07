/**
 * Plugin Name: Glossarizer
 * Author : Vinay @Pebbleroad
 * Date: 02/04/2013
 * Description: Takes glossary terms from a JSON object -> Searches for terms in your html -> Wraps a abbr tag around the matched word
 */

;(function($){

	/**
	 * Defaults
	 */
	
	var pluginName = 'glossarizer',
		defaults = {
			sourceURL     : '', /* URL of the JSON file with format {"term": "", "description": ""} */			
			replaceTag    : 'abbr', /* Matching words will be wrapped with abbr tags by default */
			lookupTagName : 'p, ul', /* Lookup in either paragraphs or lists. Do not replace in headings */
			callback      : null, /* Callback once all tags are replaced: Call or tooltip or anything you like */
			replaceOnce   : false /* Replace only once in a TextNode */,
			replaceClass: 'glossarizer_replaced'			
		}

	/**
	 * Constructor
	 */
	
	function Glossarizer(el, options){

		var base = this

		base.el = el;
		base.$el            = $(el)
		base.options        = $.extend({}, defaults, options)


		/**
		 * Terms
		 */
		
		base.terms = [];

		base.excludes = [];
		

		/**
		 * Regex Tags
		 */
		
		base.regexOption = base.options.replaceOnce? 'i': 'ig';
		
		
		/*
		Fetch glossary JSON
		 */
		
	

		$.getJSON(this.options.sourceURL).then(function(data){

			base.glossary = data;
						
			
			/**
			 * Get all terms
			 */
			
			for(var i =0; i< base.glossary.length; i++){
				
				var terms = base.glossary[i].term.split(',');

				for(var j = 0; j < terms.length; j++){

					/* Trim */

					var trimmed = terms[j].replace(/^\s+|\s+$/g, '');
					
					if(trimmed.indexOf('!') == -1){

						/* Glossary terms array */
						
						base.terms.push(trimmed)

					}else{

						/* Excluded terms array */
						
						base.excludes.push(trimmed.substr(1));
					}
				}
				
				
			}
			

			/**
			 * Wrap terms
			 */
			
			base.wrapTerms();

		})

		

	}

	/**
	 * Prototypes
	 */
	Glossarizer.prototype = {		

		getDescription: function(term){			

			var regex = new RegExp('(^\s*|[^\!])'+term+'\\s*|\\,$', 'i');

			/**
			 * Matches
			 * 1. Starts with \s* (zero or more spaces)
			 * 2. or does not contain !
			 * 3. Ends with zero or more spaces
			 * 4. Ends with comma
			 */

			for(var i =0; i< this.glossary.length; i++){				

				if(this.glossary[i].term.match(regex)){
					return this.glossary[i].description
				}				
			}				

		},
		
		/**
		 * Wraps the matched terms by calling traverser     
		 */
		wrapTerms: function(){
			
			var nodes = this.el.querySelectorAll(this.options.lookupTagName)					

			for(var i =0; i < nodes.length; i++){
				this.traverser(nodes[i])
			}      

			/**
			 * Callback
			 */
			
			if(this.options.callback) this.options.callback.call(this.$el)

		},

		/**
		 * Traverses through nodes to find the matching terms in TEXTNODES
		 */

		traverser: function(node){      

			var next,
				base = this;

			if (node.nodeType === 1) {

				/*
				 Element Node
				 */

				if (node = node.firstChild) {
						do {
							// Recursively call traverseChildNodes
							// on each child node
							next = node.nextSibling

							this.traverser(node)

						} while(node = next)
				}

			} else if (node.nodeType === 3) {

				/*
				 Text Node
				 */

				var temp = document.createElement('div'),
					data = node.data;                      

				var re = new RegExp('\\b('+this.terms.join('|')+ ')\\b', base.regexOption),
					reEx = new RegExp('\\b('+this.excludes.join('|')+ ')\\b', base.regexOption);
				
				
				if(re.test(data)){      

					var excl = reEx.exec(data);    

					data = data.replace(re,function(match){

						var ir = new RegExp('\\b'+match+'\\b'),
							result = ir.exec(data)
											

						if(result){

							if(excl){
								
								var id = result.index,
									exid = excl.index,
									exl = excl.index + excl[0].length;
								
								if(exid <= id && id <= exl){

									return match;
									
								}else{

									return '<abbr class="'+base.options.replaceClass+'" title="'+base.getDescription(match)+'">'+ match + '</abbr>'

								}
							}
							else{

								return '<abbr class="'+base.options.replaceClass+'" title="'+base.getDescription(match)+'">'+ match + '</abbr>'
							}
						}
						

					});

				}


				temp.innerHTML = data;
				
				
				while (temp.firstChild) {          
					node.parentNode.insertBefore(temp.firstChild, node)
				}

				node.parentNode.removeChild(node)

			}

		},

	};


	/**
	 * Plugin
	 * @param  {[type]} options   
	 */
	$.fn[pluginName] =function(options){

		return this.each(function(){
			if(!$.data(this, 'plugin_' + pluginName)){
				$.data(this, 'plugin_' + pluginName, new Glossarizer(this, options))
			}
		});

	}


})(jQuery);