if(! typeof paercebal !== 'undefined') { var paercebal = {} ; }
if(! typeof paercebal.HtmlSearch !== 'undefined') { paercebal.HtmlSearch = {} ; }

paercebal.HtmlSearch.widget = function(id)
{
   return document.getElementById(id);
}

paercebal.HtmlSearch.generateWidgetFullId = function(master_id, sub_id, index)
{
   return master_id + "_" + sub_id + "_" + index;
}

paercebal.HtmlSearch.doDebug = function(text)
{
   if(paercebal.HtmlSearch.widget("ID_GLOBAL_debug"))
   {
      paercebal.HtmlSearch.widget("ID_GLOBAL_debug").value += text + "\n";
   }
}

paercebal.HtmlSearch.retrieveSelectedWhere = function(master_id, index)
{
   let where = paercebal.HtmlSearch.widget(paercebal.HtmlSearch.generateWidgetFullId(master_id, "where", index));
   let optionIndex = where.selectedIndex;
   
   if(optionIndex >= 0)
   {
      return where.options.item(optionIndex).value;
   }
   
   return "";
}

paercebal.HtmlSearch.retrieveWhat = function(master_id, index, p_encoded)
{
   let what = paercebal.HtmlSearch.widget(paercebal.HtmlSearch.generateWidgetFullId(master_id, "what", index)).value.trim();
   
   if(what.length > 0)
   {
      if(p_encoded)
      {
         return encodeURIComponent(what);
      }
      
      return what;
   }
   
   return "";
}

paercebal.HtmlSearch.calculateUrlRequest = function(master_id, index)
{
   let where = paercebal.HtmlSearch.retrieveSelectedWhere(master_id, index);
   let what = paercebal.HtmlSearch.retrieveWhat(master_id, index, true);
   let whatNotEncoded = paercebal.HtmlSearch.retrieveWhat(master_id, index, false);
   
   if((where.length > 0) && (what.length > 0))
   {
      let url = where.replace("{searchTerms}", what);
      url = url.replace("{searchTermsNotEncoded}", whatNotEncoded);
      return url
   }
   
   return "";
}

paercebal.HtmlSearch.onWhereChange = function(event)
{
   let source = event.target || event.srcElement;
   
   let index = source.getAttribute("rbr_index");
   let master_id = source.getAttribute("rbr_master_id");
   let selectItem = source.options.item(source.selectedIndex);
   let img_src = selectItem.getAttribute("rbr_img_src");
   let button_text = selectItem.getAttribute("rbr_button_text");
   
   paercebal.HtmlSearch.widget(paercebal.HtmlSearch.generateWidgetFullId(master_id, "img", index)).setAttribute("src", img_src);
   paercebal.HtmlSearch.widget(paercebal.HtmlSearch.generateWidgetFullId(master_id, "search", index)).textContent = button_text;
   paercebal.HtmlSearch.widget(paercebal.HtmlSearch.generateWidgetFullId(master_id, "what", index)).focus();
}

paercebal.HtmlSearch.onEnterDoSearch = function(event)
{
   if(event.keyCode == 13)
   {
      let source = event.target || event.srcElement;
      let index = source.getAttribute("rbr_index");
      let master_id = source.getAttribute("rbr_master_id");
      paercebal.HtmlSearch.doSearch(master_id, parseInt(index, 10));
   }
}

paercebal.HtmlSearch.onSearchClick = function(event)
{
   let source = event.target || event.srcElement;
   let index = source.getAttribute("rbr_index");
   let master_id = source.getAttribute("rbr_master_id");
   paercebal.HtmlSearch.doSearch(master_id, parseInt(index, 10));
}

paercebal.HtmlSearch.doSearch = function(master_id, index)
{
   let url = paercebal.HtmlSearch.calculateUrlRequest(master_id, index);
   
   //alert("[" + url + "]");
   
   if(url.length > 0)
   {
      window.open(url, "");
   }
}

paercebal.HtmlSearch.generateOneSearchLine = function(parent, master_id, searchBoxesData, index)
{
   let div = document.createElement("div");
   div.setAttribute("class", "cssSearchBox");
   parent.appendChild(div);
   
   let imgData = "";
   let buttonText = "";
   
   {
      let select = document.createElement("select");
      select.setAttribute("rbr_index", index);
      select.setAttribute("rbr_master_id", master_id);
      select.setAttribute("id", paercebal.HtmlSearch.generateWidgetFullId(master_id, "where", index));
      select.setAttribute("class", "cssWhere");
      select.setAttribute("tabindex", "0");
      select.onchange = paercebal.HtmlSearch.onWhereChange;
      div.appendChild(select);

      for(let i = 0, iMax = searchBoxesData.full_list.list.length; i < iMax; ++i)
      {
         let item = searchBoxesData.full_list.list[i];
         let option = document.createElement("option");
         option.setAttribute("value", item.url);
         option.textContent = item.name;
         option.setAttribute("rbr_img_src", item.image);
         option.setAttribute("rbr_button_text", item.button);

         //paercebal.HtmlSearch.doDebug("[" + item.id + "] != [" + searchBoxesData.orderedList + "]");

         if((searchBoxesData.orderedList.length > index) && (item.id == searchBoxesData.orderedList[index]))
         {
            //paercebal.HtmlSearch.doDebug("selected");
            option.setAttribute("selected", "selected");
            imgData = item.image;
            buttonText = item.button;
         }
         else if((i == 0) && (imgData.length == 0))
         {
            imgData = item.image;
            buttonText = item.button;
         }
         
         select.appendChild(option);
      }
   }
   
   {
      let input = document.createElement("input");
      input.setAttribute("rbr_index", index);
      input.setAttribute("rbr_master_id", master_id);
      input.setAttribute("id", paercebal.HtmlSearch.generateWidgetFullId(master_id, "what", index));
      input.setAttribute("class", "cssWhat");
      input.setAttribute("type", "text");
      input.setAttribute("value", "");
      input.setAttribute("tabindex", "0");
      input.onkeyup = paercebal.HtmlSearch.onEnterDoSearch;
      div.appendChild(input);
   }
   
   {
      let button = document.createElement("button");
      button.setAttribute("rbr_index", index);
      button.setAttribute("rbr_master_id", master_id);
      button.setAttribute("id", paercebal.HtmlSearch.generateWidgetFullId(master_id, "search", index));
      button.setAttribute("class", "cssSearch");
      button.setAttribute("type", "button");
      button.textContent = buttonText;
      button.setAttribute("tabindex", "-1");
      button.onclick = paercebal.HtmlSearch.onSearchClick;
      div.appendChild(button);
   }
   
   {
      let divIcon = document.createElement("div");
      divIcon.setAttribute("rbr_index", index);
      divIcon.setAttribute("rbr_master_id", master_id);
      divIcon.setAttribute("class", "cssIcon");
      div.appendChild(divIcon);
      
      {
         let img = document.createElement("img");
         img.setAttribute("rbr_index", index);
         img.setAttribute("rbr_master_id", master_id);
         img.setAttribute("id", paercebal.HtmlSearch.generateWidgetFullId(master_id, "img", index));
         img.setAttribute("src", imgData);
         divIcon.appendChild(img);
      }
   }
}




paercebal.HtmlSearch.SearchBoxesFullList = function()
{
   this.list = [];
}

paercebal.HtmlSearch.SearchBoxesFullList.prototype.itemGeneric = function(id, name, url, description, button, image)
{
   var o = {};
   o.id = id;
   o.name = name;
   o.url = url;
   o.description = description;
   o.button = button;
   o.image = image;
   this.list.push(o);
}

paercebal.HtmlSearch.SearchBoxesFullList.prototype.item = function(id, name, url, description, image)
{
   return this.itemGeneric(id, name, url, description, "Search", image);
}

paercebal.HtmlSearch.SearchBoxesFullList.prototype.itemTranslate = function(id, name, url, description, image)
{
   return this.itemGeneric(id, name, url, description, "Translate", image);
}

paercebal.HtmlSearch.SearchBoxesFullList.prototype.itemSynonyms = function(id, name, url, description, image)
{
   return this.itemGeneric(id, name, url, description, "Synonyms", image);
}




paercebal.HtmlSearch.SearchBoxesData = function(full_list)
{
   this.count = 10;
   this.full_list = full_list;
   this.orderedList = [];
}

paercebal.HtmlSearch.SearchBoxesData.prototype.setCount = function(c)
{
   this.count = c;
}

paercebal.HtmlSearch.SearchBoxesData.prototype.getCalculatedCount = function(c)
{
   return (this.count < this.orderedList.length) ? this.count : this.orderedList.length;
}

paercebal.HtmlSearch.SearchBoxesData.prototype.orderedItem = function(id)
{
   this.orderedList.push(id);
}


paercebal.HtmlSearch.changeDisplay = function(box)
{
   paercebal.HtmlSearch.widget(box).setAttribute("class", "cssDisplayBox");
   
   for(let i = 1, iMax = arguments.length; i < iMax; ++i)
   {
      paercebal.HtmlSearch.widget(arguments[i]).setAttribute("class", "cssDisplayNone");
   }
}



paercebal.HtmlSearch.generateSearchBoxes = function(div_id, searchBoxesData)
{
   let parent = paercebal.HtmlSearch.widget(div_id);
   let i, iMax;
   
   for(i = 0, iMax = searchBoxesData.getCalculatedCount(); i < iMax; ++i)
   {
      paercebal.HtmlSearch.generateOneSearchLine(parent, div_id, searchBoxesData, i);
   }
}

