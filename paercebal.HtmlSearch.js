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

paercebal.HtmlSearch.retrieveWhat = function(master_id, index)
{
   let what = paercebal.HtmlSearch.widget(paercebal.HtmlSearch.generateWidgetFullId(master_id, "what", index)).value.trim();
   
   if(what.length > 0)
   {
      return encodeURIComponent(what);
   }
   
   return "";
}

paercebal.HtmlSearch.calculateUrlRequest = function(master_id, index)
{
   let where = paercebal.HtmlSearch.retrieveSelectedWhere(master_id, index);
   let what = paercebal.HtmlSearch.retrieveWhat(master_id, index);
   
   if((where.length > 0) && (what.length > 0))
   {
      let url = where.replace("{searchTerms}", what);
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
   
   if(url.length > 0)
   {
      window.open(url, "");
   }
}

paercebal.HtmlSearch.generateOneSearchLine = function(parent, master_id, list, orderedList, index)
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

      for(let i = 0, iMax = list.length; i < iMax; ++i)
      {
         let item = list[i];
         let option = document.createElement("option");
         option.setAttribute("value", item.url);
         option.textContent = item.name;
         option.setAttribute("rbr_img_src", item.image);
         option.setAttribute("rbr_button_text", item.button);

         //paercebal.HtmlSearch.doDebug("[" + item.id + "] != [" + orderedList + "]");

         if((orderedList.length > index) && (item.id == orderedList[index]))
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

paercebal.HtmlSearch.prioritizeList = function(list)
{
}

paercebal.HtmlSearch.generateSearchBoxes = function(div_id, count, list, orderedList)
{
   let parent = paercebal.HtmlSearch.widget(div_id);
   let i, iMax;
   
   for(i = 0, iMax = count; i < iMax; ++i)
   {
      paercebal.HtmlSearch.generateOneSearchLine(parent, div_id, list, orderedList, i);
   }
}

paercebal.HtmlSearch.g_count = 10;
paercebal.HtmlSearch.g_list = [];
paercebal.HtmlSearch.g_orderedlist = [];

paercebal.HtmlSearch.count = function(c)
{
   paercebal.HtmlSearch.g_count = c;
}

paercebal.HtmlSearch.orderedItem = function(id)
{
   paercebal.HtmlSearch.g_orderedlist.push(id);
}

paercebal.HtmlSearch.itemGeneric = function(id, name, url, description, button, image)
{
   var o = {};
   o.id = id;
   o.name = name;
   o.url = url;
   o.description = description;
   o.button = button;
   o.image = image;
   paercebal.HtmlSearch.g_list.push(o);
}

paercebal.HtmlSearch.item = function(id, name, url, description, image)
{
   return paercebal.HtmlSearch.itemGeneric(id, name, url, description, "Search", image);
}

paercebal.HtmlSearch.itemTranslate = function(id, name, url, description, image)
{
   return paercebal.HtmlSearch.itemGeneric(id, name, url, description, "Translate", image);
}

paercebal.HtmlSearch.itemSynonyms = function(id, name, url, description, image)
{
   return paercebal.HtmlSearch.itemGeneric(id, name, url, description, "Synonyms", image);
}

