/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-11-19 23:23:45
 * @version $Id$
 */

 var Rummi={
 	currentState:'initial',
 	cardArray:new Array(106),
 	cardRested:new Array(106),
 	numdeckOnTable:0,
 	cardHolded:[],
 	cardChosed:[],
 	currentPlayer:'player1',
 	drawClick:false,
 	played_true:false,
 	drawAlready:false
 };
$(document).ready(function(){
	localStorage.setItem('player1Holded',null);
	localStorage.setItem('player1State','initial');
	localStorage.setItem('player2Holded',null);
	localStorage.setItem('player2State','initial');
	for(var i=0;i<106;i++){
		Rummi.cardArray[i]=i;
	}
    for(var i=0;i<106;i++){
		Rummi.cardRested[i]=i;
	}
	$("#drawcard").click(function(){
		var index;
		Rummi.drawClick=true;
		if(Rummi.currentState=='draw'||Rummi.currentState=='initial_draw'&&Rummi.drawAlready==false){
			Rummi.drawAlready=true;
			var indextemp=Math.floor(Math.random()*Rummi.cardRested.length);
			Rummi.cardHolded.push(Rummi.cardRested[indextemp]);
			index=Rummi.cardRested[indextemp];
			Rummi.cardRested.splice(indextemp,1);
			var card_class=card_classfied(index);
			var $card;
			if(card_class=='ghost'){
				$card=$('<div class="'+card_class+'" id="'+index+'"></div>');
			}else{
				var indexout=index%13+1;
				$card=$('<div class="'+card_class+'" id="'+index+'">'+indexout+'</div>');
			}

            $("#cardplace").append($card);
            if(Rummi.currentState=='draw')
            	Rummi.currentState='play';
            else if(Rummi.currentState=='initial_drawdraw')
            	Rummi.currentState='initial_play';
            $("#"+index).click(function(){
				var chosed=false;
				var chosed_index;
				var temp_class;
				for(var i=0;i<Rummi.cardChosed.length;i++){
					if(Rummi.cardChosed[i]==index){
						chosed=true;
						chosed_index=i;
					}
				}
				
				if(chosed==false){
					$(this).addClass("chosed");
					Rummi.cardChosed.push(index);
				}else {
					
					$(this).removeClass("chosed");
					Rummi.cardChosed.splice(chosed_index,1);
				}	

				$(function() {
    				$( ".chosed" ).draggable({
    				 disabled: false,	
                     addClasses:false,
      
 					 drag: function( event, ui ) {$(".chosed" ).css({
            				top: ui.position.top,
            				left: ui.position.left
            				});
 					 	},
					});

  				});
				
		});   
      		
		}else if(Rummi.currentState=='initial'){
			for(var i=0;i<4;i++){
				var indextemp=Math.floor(Math.random()*Rummi.cardRested.length);
				Rummi.cardHolded.push(Rummi.cardRested[indextemp]);
				index=Rummi.cardRested[indextemp];
				Rummi.cardRested.splice(indextemp,1);
				var card_class=card_classfied(index);
				var $card;
				if(card_class=='ghost'){
					$card=$('<div class="'+card_class+'" id="'+index+'"></div>');
				}else{
					var indexout=index%13+1;
					$card=$('<div class="'+card_class+'" id="'+index+'">'+indexout+'</div>');
				}
	            $("#cardplace").append($card);
	            $("#"+index).click(function(){
	            
				var chosed=false;
				var chosed_index;
				var temp_class;
				for(var j=0;j<Rummi.cardChosed.length;j++){
					if(Rummi.cardChosed[j]==$(this).attr("id")){
						chosed=true;
						chosed_index=j;
					}
				}
				
				if(chosed==false){
					$(this).addClass("chosed");
					Rummi.cardChosed.push($(this).attr("id"));
				}else {
					
					$(this).removeClass("chosed");
					Rummi.cardChosed.splice(chosed_index,1);
				}	

				$(function() {
    				$( ".chosed" ).draggable({
    				 disabled: false,	
                     addClasses:false,
      
 					 drag: function( event, ui ) {$(".chosed" ).css({
            				top: ui.position.top,
            				left: ui.position.left
            				});
 					 	},
					});

  				});
				
			}); 
	        }
	        Rummi.currentState='initial_draw'; 

		}else if(Rummi.drawAlready==true){
			alert("Draw can only draw one time!");
		}
		adjust_card();
		
		
		$(function() {
			$( "#cardplayed" ).droppable({
				 accept: '.chosed',
            	drop:function(event,ui){
            		Rummi.numdeckOnTable=Rummi.numdeckOnTable+1;
            		Rummi.played_true=true;
                    $(".chosed").removeClass("ui-draggable-handle ui-draggable-dragging");
            		var deck_id='numdeck'+Rummi.numdeckOnTable;
            		var width=28*$(".chosed").length;
            		$(this).append($('<div class="deck" id="'+deck_id+'">'));
            		$("#"+deck_id).css("width",width);
        
            		$(".chosed").each(function(){
            			$(this).appendTo("#"+deck_id);
            			$(this).css("top","0px");
            			$(this).css("left","0px");
            			$(this).removeClass("chosed");
            			$(this).addClass("inDeck");
            			for(var i=0;i<Rummi.cardChosed.length;i++){
							if(Rummi.cardChosed[i]==$(this).attr("id")){
								chosed_index=i;
							}
						}
            			Rummi.cardChosed.splice(chosed_index,1);
            		});
            		$(function() {
            			$( ".deck" ).droppable({
							 accept: '.chosed',
							 tolerance:'pointer',
							 greedy: true,
            				drop:function(event,ui){
            	     	        
            	     	       var width=28*($(".chosed").length+$(this).children().length);
            	     	       $(this).css("width",width);
            	     	       $(this).append($(".chosed"));
            	     	       $(".chosed").removeClass("ui-draggable-handle ui-draggable-dragging");	
            				   $(".chosed").each(function(){
	            			      $(this).css("top","0px");
	            			      $(this).css("left","0px");
	            			      $(this).removeClass("chosed");
	            			      $(this).addClass("inDeck");

	            		          for(var i=0;i<Rummi.cardChosed.length;i++){
										if(Rummi.cardChosed[i]==$(this).attr("id")){
											chosed_index=i;
									    }
							      }
	            		          Rummi.cardChosed.splice(chosed_index,1);
	            		       });
            				}
            			});	
             	    });
            	}

             });
		});
		$(function() {
            	$( "#cardplace" ).droppable({
					accept: '.inDeck',
					tolerance:'touch',
					greedy: true,
            		drop:function(event,ui){
            	    $(this).append($(".chosed"));
            	    $(ui.draggable).removeClass("ui-draggable-handle ui-draggable-dragging");	
            	    $(".chosed").each(function(){
		                $(this).css("top","10px");
		            	$(this).css("left","5px");
		            	$(this).removeClass("chosed");
		            	$(this).removeClass("inDeck");
		            	alert($(this).attr("class"));
		            	for(var i=0;i<Rummi.cardChosed.length;i++){
							if(Rummi.cardChosed[i]==$(this).attr("id")){
								chosed_index=i;
							 }
						}
		            	Rummi.cardChosed.splice(chosed_index,1);
	                });
            	    }
                });	
         });
	}); //draw click
	$("#finish").click(function(){
		var total_icebreak=0;
		var succes_index=0;
		
		var temp_playArray=new Array;
		if(Rummi.drawClick==true || Rummi.played_true==true){
			$(".deck").each(function(){

				var cardID_array=new Array;
				var check_index=1;
				var sort_index=1;
				var sort_temp ;
				$(this).children().each(function(){
					var cardID=parseInt($(this).attr("id"));
					if(cardID==104||cardID==105){
						cardID=1000;
					}else{
						cardID=cardID%13;
					}
					cardID_array.push(cardID);
				});
				cardID_array.sort(function(a,b){return a-b;});// ascend order
				for(var i=0;i<cardID_array.length;i++){
					var check_index_temp=1;
					if(i==0){
						sort_temp=cardID_array[i];
					}else if(i<cardID_array.length){
						if(sort_temp==(cardID_array[i]-1)){
							sort_index=sort_index+1;
							sort_temp=sort_temp+1;

						}else if(cardID_array[cardID_array.length-1]=='1000'){
							if(cardID_array[cardID_array.length-2]=='1000'){
								var check_ghost=0;
								for(var j=0;j<cardID_array.length-3;j++){
									check_ghost=cardID_array[j+1]-cardID_array[j]+check_ghost;
								}
								if(check_ghost>=(cardID_array.length-1+2)){
									sort_index=cardID_array.length;
								}
							}else{
								var check_ghost=0;
								for(var j=0;j<cardID_array.length-2;j++){
									check_ghost=cardID_array[j+1]-cardID_array[j]+check_ghost;
								}
								if(check_ghost>=(cardID_array.length-1+1)){
									sort_index=cardID_array.length;
								}
							}
						}
						else{
							sort_index=1;
							sort_temp=cardID_array[i]
						}
					}
					for(var j=i+1;j<cardID_array.length;j++){
						if(cardID_array[i]==cardID_array[j] || cardID_array[j]==1000){
							check_index_temp=check_index_temp+1;
						}
					}
					if(check_index<check_index_temp){
						check_index=check_index_temp;
					}
				}
				if(Rummi.currentState!='initial_draw'){
					if((check_index>=3 && check_index==cardID_array.length)||(sort_index>=3&& sort_index==cardID_array.length)){
						$(this).addClass("correct_desk");
					}
					else{
						$(this).removeClass("correct_desk");
					}
					Rummi.currentState='draw';
					
					if(!$(this).hasClass('correct_desk')){
						$(this).children().each(function(){
							$(this).removeClass('inDeck');
							$(this).appendTo($("#cardplace"));
						});
						$(this).remove();
					}
					
					
					$(this).children().each(function(){
						for(var i=0;i<Rummi.cardHolded.length;i++){
							if($(this).attr('id')==Rummi.cardHolded[i]){
								Rummi.cardHolded.splice(i,1);
							}
						}
					});
					
				}else if(Rummi.currentState=='initial_draw'){
                    
					if(((check_index>=3 && check_index==cardID_array.length)||(sort_index>=3&& sort_index==cardID_array.length))){
						$(this).addClass("correct_desk");		
					}else{
						$(this).removeClass("correct_desk");
					}
					
					if(!$(this).hasClass('correct_desk')){
						$(this).children().each(function(){
							$(this).removeClass('inDeck');
							$(this).appendTo($("#cardplace"));
						});
						$(this).remove();
					}
					
					
					$(this).children().each(function(){
						for(var i=0;i<Rummi.cardHolded.length;i++){
							if($(this).attr('id')==Rummi.cardHolded[i]){
								total_icebreak=total_icebreak+parseInt($(this).attr('id'));
								//Rummi.cardHolded.splice(i,1);
								temp_playArray.push($(this));
								
							}
						}
					});
					if(total_icebreak>=30){
						$(this).children().each(function(){
						for(var i=0;i<Rummi.cardHolded.length;i++){
							if($(this).attr('id')==Rummi.cardHolded[i]){
								//total_icebreak=total_icebreak+parseInt($(this).attr('id'));
								Rummi.cardHolded.splice(i,1);
							}
						}
						});
						succes_index=1;
						Rummi.currentState='draw';
					}else{
						for(var kk=0;kk<temp_playArray.length;kk++){
						    temp_playArray[kk].removeClass('inDeck');
						    temp_playArray[kk].appendTo($("#cardplace"));
							temp_playArray[kk].remove();
						}
						succes_index=0;
					
					}
					
				}	
				
			})
			if(succes_index==1 && Rummi.currentState=='initial_draw'){
					alert('success ice break!');
			}else if(succes_index==0 && Rummi.currentState=='initial_draw'){
					alert('need ice break!');
			}
			Rummi.drawClick=false;
			Rummi.played_true=false;
			Rummi.drawAlready=false;
			alert('next turn!');
		var player_card=Rummi.currentPlayer+'Holded';
		var player_state=Rummi.currentPlayer+'State';
		localStorage.setItem(player_card,JSON.stringify(Rummi.cardHolded));
		localStorage.setItem(player_state,Rummi.currentState);
		Rummi.currentPlayer=changePlayer(Rummi.currentPlayer);
		player_card=Rummi.currentPlayer+'Holded';
		player_state=Rummi.currentPlayer+'State';
		var temp_JSON=localStorage.getItem(player_card);
		if(temp_JSON=='null'){
			Rummi.cardHolded=new Array;
		}else{
			Rummi.cardHolded=JSON.parse(temp_JSON);
		}
			
		Rummi.currentState=localStorage.getItem(player_state);
		$("#cardplace").children().each(function(){
			$(this).remove();
		});
		for(var tt=0;tt<Rummi.cardHolded.length;tt++){
				index=Rummi.cardHolded[tt];
				var card_class=card_classfied(index);
				var $card;
				if(card_class=='ghost'){
					$card=$('<div class="'+card_class+'" id="'+index+'"></div>');
				}else{
					var indexout=index%13+1;
					$card=$('<div class="'+card_class+'" id="'+index+'">'+indexout+'</div>');
				}
	            $("#cardplace").append($card);
	            $("#"+index).click(function(){
	            
				var chosed=false;
				var chosed_index;
				var temp_class;
				for(var j=0;j<Rummi.cardChosed.length;j++){
					if(Rummi.cardChosed[j]==$(this).attr("id")){
						chosed=true;
						chosed_index=j;
					}
				}
				
				if(chosed==false){
					$(this).addClass("chosed");
					Rummi.cardChosed.push($(this).attr("id"));
				}else {
					
					$(this).removeClass("chosed");
					Rummi.cardChosed.splice(chosed_index,1);
				}	

				$(function() {
    				$( ".chosed" ).draggable({
    				 disabled: false,	
                     addClasses:false,
      
 					 drag: function( event, ui ) {$(".chosed" ).css({
            				top: ui.position.top,
            				left: ui.position.left
            				});
 					 	},
					});

  				});
				
			}); 
		}
		}// if length
		else{
			alert("you have not drawed or played yet!");
		}
		
		
	})//end .click finish
	

});
function card_classfied(index){
 	var card_class;
	if(index==105||index==104){
		card_class='ghost';
	}else if(index%4==0){
		card_class='blue';
	}
	else if(index%4==1){
		card_class='red';
	}
	else if(index%4==2){
		card_class='orange';
	}
	else if(index%4==3){
		card_class='green';
	}
	return card_class;
}
function adjust_card(){
	var card_class;
	if(Rummi.cardHolded.length<=12){
			for(var i=0;i<Rummi.cardHolded.length;i++){
				card_class=card_classfied(Rummi.cardHolded[i]);
				//alert(!$("#"+Rummi.cardHolded[i]).hasClass("inDeck"));
				if(!$("#"+Rummi.cardHolded[i]).hasClass("inDeck"))
					$("#"+Rummi.cardHolded[i]).attr("class",card_class);
			}
	}else if(Rummi.cardHolded.length>12 && Rummi.cardHolded.length<=24){
			for(var i=0;i<Rummi.cardHolded.length;i++){
				card_class=card_classfied(Rummi.cardHolded[i]);
				card_class=card_class+'_2';
				if(!$("#"+Rummi.cardHolded[i]).hasClass("inDeck"))	
					$("#"+Rummi.cardHolded[i]).attr("class",card_class);
			}
	}else {
			for(var i=0;i<Rummi.cardHolded.length;i++){
				card_class=card_classfied(Rummi.cardHolded[i]);
				card_class=card_class+'_3';
				if(!$("#"+Rummi.cardHolded[i]).hasClass("inDeck"))
					$("#"+Rummi.cardHolded[i]).attr("class",card_class);
			}
	
	}
}
function changePlayer(current){
	if(current=='player1'){
		return 'player2';
	}else{
		return 'player1';
	}

}