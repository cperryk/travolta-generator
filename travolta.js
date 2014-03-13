$(function() {
	/*	
		A homonym is a word that sounds the same as another word but is spelled differently.
		Each set of names in the list below is a set of homonyms.
		There is a logic to make it unlikely that the output name will be merely a
		alternative spelling of the input name, but the list below provides a manual
		override in case that logic does not capture all common cases.
	*/
	var HOMONYMS = [
		['Rebecca','Rebekah'],
		['lewis','louis','louise'],
		['jon','john']
	];
	function Interactive() {
		this.container = $('#int');
		this.addEventListeners();
	}
	Interactive.prototype = {
		addEventListeners: function() {
			var self = this;
			$(".int_input")
				.each(function() {
					$(this).data('default_input', $(this).val());
				})
				.focus(function() {
					if (!$(this).hasClass('edited')) {
						$(this).val('').addClass('edited');
					}
					$(this).unbind('enterkeygo').on('keydown.enterkeygo', function(e) {
						if (e.keyCode === 13) {
							self.generate($(this).val());
						}
					});
				})
				.blur(function() {
					if ($(this).val() === '') {
						$(this)
							.removeClass('edited')
							.val($(this).data('default_input'));
					}
				})
				.keydown(function() {
					if ($(this).val() === '') {
						$('#btn_generate').removeClass('activated');
					} else {
						$('#btn_generate').addClass('activated');
					}
				});
			$('#btn_generate').click(function() {
				if ($(this).hasClass('activated')) {
					self.generate($('.int_input').val());
				}
			});
			$('.btn_edit').click(function() {
				$('#frame_2').slideUp();
				$('#frame_1').slideDown();
				self.container
					.find('input')
						.val('')
						.removeClass('edited')
						.end()
					.find('#btn_generate')
						.removeClass('activated')
						.end()
					.find('#input_name')
						.focus()
						.end();
			});
			$('#btn_tw_share').click(function(){
				Sharing.twitterShare('My Travoltified Name is '+self.output_name+'! What\'s yours?',self.getShareLink());
			});
			$('#btn_fb_share').click(function(){
				Sharing.facebookShare({
					head:'My Travoltified Name is '+self.output_name+'!',
					desc:'How would John Travolta botch your name?',
					img:'http://www.slate.com/features/2014/03/travolta/graphics/travolta2.jpg',
					url:self.getShareLink()
				});
			});
			$('#btn_get_link').click(function(){
				var t = prompt("Copy the link below:",self.getShareLink());
			});
			$('#btn_email_share').click(function(){
				var link = "mailto:" + "?subject=" + escape("My Travoltified name is \""+self.output_name)+"\"&body=Get yours at Slate.com: "+window.location;
				window.location.href = link;
			});
		},
		/**
		 * Take the inputted name, get a travolitifed name, and update the view to display it
		 * and the share buttons.
		 * @param  {[string]} name
		 * @return {[null]}
		 */
		generate: function(name) {
			this.input_name = name;
			$('#frame_1').slideUp();
			$('.real_name_here').html(name);
			this.output_name = this.getOutputName(name.toLowerCase());
			$('.name_here').html('"' + this.output_name + '"');
			$('#frame_2').slideDown(function() {
				$('#bottom_btns').fadeIn(); // the share buttons
			});
		},
		/**
		 * Take the user's input name and retrun a travoltified name.
		 * @param  {[string]} name
		 * @return {[string]} travoltified name
		 */
		getOutputName: function(name) {
			/**
			 * Bias Math.random() so that it always outputs the same seemingly random numbers based on $name.
			 * his adds a slight element of extra randomness to the generation function, so that if two output
			 * first names are scored equally, the first one in the list of potential first names does not always
			 * prevail.
			 */
			Math.seedrandom(name);

			// Manual logic that outputs "Adele Dazeem" with the input name "Idina Menzel"
			if (name === 'idina menzel') {
				return 'Adele Dazeem';
			}

			var split = name.split(' ');
			var out_first = processName(split[0], 'first');
			var out_last;
			if (split.length > 1) {
				out_last = processName(split[1], 'last');
			}
			return out_first + (out_last?(' '+out_last):'');
			function scrambleArray(myArray) {
				var i = myArray.length,
					j, tempi, tempj;
				if (i===0) return false;
				while (--i) {
					j = Math.floor(Math.random() * (i + 1));
					tempi = myArray[i];
					tempj = myArray[j];
					myArray[i] = tempj;
					myArray[j] = tempi;
				}
			}
			/**
			 * Using $name of $type ("first" or "last"), look at the list of first or last names and
			 * find a name that closely matches $name based on a variety of factors, including
			 * syllable count and character matches.
			 * @param  {[string]} name
			 * @param  {[string]} type "first" or "last"
			 * @return {[string]} The highest-scoring matched name
			 */
			function processName(name, type) {
				var names = NAMES[type].slice(0,NAMES[type].length); // Clone the relevant potential names array
				var exclusions = (function getExclusions(){
					/* Search through HOMONYMS to see if the input_name is in it, and, if so, add its homonyms to a list of names
					to exclude.
					*/
					var homonyms = HOMONYMS;
					var exclusions = [];
					for(var i=0;i<homonyms.length;i++){
						if(homonyms[i].indexOf(name)>-1){
							return homonyms[i];
						}
					}
					return [];
				}(name));
				scrambleArray(names);
				var best = {
					name: '',
					score: 0
				};
				for(var i = 0; i < names.length; i++) {
					var score = scoreName(name, names[i].toLowerCase(),type);
					if (score > best.score) {
						best.name = names[i];
						best.score = score;
					}
				}
				return capitaliseFirstLetter(best.name);

				function capitaliseFirstLetter(string) {
					return string.charAt(0).toUpperCase() + string.slice(1);
				}

				function scoreName(real_name, compare_name, type) {
					
					/* Score the $compare_name according to its similarity to $real_name, using a variety of factors */
					var score = 0;
					if (compare_name === real_name || (exclusions.indexOf(compare_name) !== -1)){
						return 0;
					}

					// Increase the score if the $compare_name has the same number of syllables as the $real_name
					if (countSyllables(real_name) === countSyllables(compare_name)) {
						score += 10;
					}

					var character_matches = getCharacterMatches(real_name,compare_name);
					var matches = character_matches.matches;
					var mismatches = character_matches.mismatches;

					score += matches;
					score -= mismatches;

					var first_letter_matches = real_name[0] == compare_name[0];
					var last_letter_matches = real_name[real_name.length - 1] == compare_name[compare_name.length - 1];
					if (first_letter_matches) {
						score += 20;
					}
					if (last_letter_matches) {
						score += 5;
					}

					/**
					 * Penalize $compare_name if its first or letter matches $real_name's and the number of characters different
					 * between them represent less than a fourth of $real_name's length. This is to penalize names that
					 * are alternative spellings to $real_name.
					 */
					if (type === 'first' && (first_letter_matches || last_letter_matches) && ((mismatches / real_name.length) <= 0.25)) {
						score -= 50;
					}

					return score;

					/**
					 * Returns the number of characters shared ($matches) and the number of characters not shared ($mismatches) between two strings.
					 * @param  {[string]} word1
					 * @param  {[string]} word2
					 * @return {[dictionary]}
					 */
					function getCharacterMatches(word1,word2){
						var word1_uniques = getUniques(word1);
						var word2_uniques = getUniques(word2);
						return compareArrays(word1_uniques,word2_uniques);

						/**
						 * Returns a list of the unique characters of a string.
						 * @param  {[string]} word
						 * @return {[array]}
						 */
						function getUniques(word){
							var uniques = [];
							for(var i=0;i<word.length;i++){
								var character = word[i];
								if(uniques.indexOf(character)===-1){
									uniques.push(character);
								}
							}
							return uniques;
						}

						/**
						 * Returns the number of shared items and nunber of unshared items between two arrays.
						 * @param  {[array]} l1
						 * @param  {[array]} l2
						 * @return {[dictionary]} includes $matches and $mismatches
						 */
						function compareArrays(l1,l2){
							var matches = [];
							var mismatches = [];
							for(var i=0;i<l1.length;i++){
								var char1 = l1[i];
								if(l2.indexOf(char1)>-1){
									matches.push(char1);
								}
								else{
									mismatches.push(char1);
								}
							}
							for(i=0;i<l2.length;i++){
								char2 = l2[i];
								if(matches.indexOf(char2)===-1&&mismatches.indexOf(char2)===-1){
									if(l1.indexOf(char2)>-1){
										matches.push(char2);
									}
									else{
										mismatches.push(char2);
									}
								}
							}
							return {matches:matches.length,mismatches:mismatches.length};
						}
					}

					function countSyllables(word) {
						word = word.toLowerCase(); //word.downcase!
						if (word.length <= 3) {
							return 1;
						} //return 1 if word.length <= 3
						word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
						word = word.replace(/^y/, ''); //word.sub!(/^y/, '')
						var match = word.match(/[aeiouy]{1,2}/g);
						if(match){
							return match.length;
						}
						else{
							return 1;
						}
					}
				}
			}

			function getLettersByType(name) { 
				// Return a list of all unique letters in $name, grouped by type (consonant / vowel).
				var vowels = ['a', 'e', 'i', 'o', 'u'];
				var out = {
					vowels: [],
					consonants: []
				};
				for (var i = 0; i < name.length; i++) {
					var character = name[i];
					if (vowels.indexOf(character) > -1 && out.vowels.indexOf(character) === -1) {
						out.vowels.push(character);
					} else if (out.consonants.indexOf(character) === -1) {
						out.consonants.push(character);
					}
				}
				return out;
			}
		},
		getShareLink:function(){
			//return Sharing.getURL() + '?' + 'name=' + this.input_name.replace(/ /g,'_');
			return Sharing.getURL();
		}
	};
	var Sharing = {
		getURL: function() {
			return $(location).attr('href').indexOf('?') > -1 ? $(location).attr('href').substring(0, $(location).attr('href').indexOf('?')) : $(location).attr('href');
		},
		twitterShare: function(share_text,url) {
			var width = 575,
				height = 400,
				left = ($(window).width() - width) / 2,
				top = ($(window).height() - height) / 2,
				opts = 'status=1' +
					',width=' + width +
					',height=' + height +
					',top=' + top +
					',left=' + left;
			var share_link_encoded = encodeURIComponent(url||Sharing.getURL());
			var URL = 'http://twitter.com/intent/tweet?text=' + share_text + '&url=' + share_link_encoded + '&hashtags=JohnTravoltaNames&via=Slate';
			window.open(URL, 'twitter', opts);
		},
		facebookShare: function(conf) {
			//conf.head, conf.img, and conf.desc
			var obj = {
				method: 'feed',
				link: conf.url||Sharing.getURL(),
				picture: conf.img,
				name: conf.head,
				caption: 'Slate.com',
				description: conf.desc
			};

			function callback(response) {
				document.getElementById('msg').innerHTML = "Post ID: " + response.post_id;
			}
			FB.ui(obj, callback);
		}
	};
	//Sharing.twitterShare('test');
	var my_int = new Interactive();

});