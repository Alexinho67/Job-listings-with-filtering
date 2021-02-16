
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log(time)
var tag_divs = document.getElementsByClassName("tags")
var filter = document.getElementById("filter")
var items = document.getElementsByClassName("item")
// var tag_dict = new Object();
// tag_dict['language'] = [];
// tag_dict['tool'] = [];
var tag_dict = {'language':[], 'tool':[]};

var clearbtn = document.getElementById("clearbtn");
clearbtn.addEventListener("click", clear_search_bar)

for (var div of tag_divs){
    var role = div.getElementsByClassName("role")
    var level = div.getElementsByClassName("level")
    var language = div.getElementsByClassName("language")
    role[0].addEventListener("click", add_to_filter)
    level[0].addEventListener("click", add_to_filter)
    for (var l of language){
        l.addEventListener("click", add_to_filter)
    }
}


function add_to_filter(ev){
    var el = ev.target;
    // console.log(el.innerHTML);
    filter.style.visibility = 'visible';
    var type = undefined;
    if(el.dataset.role){
        // console.log("is role")
        type = "role";
    }else if(el.dataset.level){
        // console.log("is level")
        type = "level";
    }else if(el.dataset.languages){
        // console.log("is language")
        type = "language";
    }else if (el.dataset.tools){
        // console.log("is tool")
        type = "tool";
    }else{
        console.log("unknown data")
    }

    var str_tag = el.innerHTML.match(/\w+/g)[0]

    // check for "role" and "level"
    if (type=="role" || type=="level"){
        if(type in tag_dict){
            console.log(`Tag_dict already has a key ${type}. It's value is ${tag_dict[type]}`)
        }else{
            tag_dict[type]=str_tag;
            console.log(`Added key ${type}=${str_tag} to the tag_dict`)
            globalThis.log = tag_dict;
        }
    }else if(type=="language" || type=="tool"){   // check for "languages" and "tools"
        let lang_filter_bar = tag_dict[type]; // returns the list of already selected "languages" "or "tool
        if (lang_filter_bar.indexOf(str_tag)>-1){
            console.log(`Tag_dict in ${type} already contains this value.`)    
        }else{
            lang_filter_bar.push(str_tag)
        }
    }else{
        console.log("XXX")
    }
    
    console.log(tag_dict);    
    update_filter_bar();
    console.log("================================");    

    // update_search_results()
}

function update_filter_bar(){
    filter.innerText = ""
    var icon = document.createElement("img");
    icon.src ="images/icon-remove.svg";
    icon.classList.add("remove_btn");

    icon.addEventListener("click", clear_tag) ;
    if ("role" in tag_dict){
        let span = document.createElement("span");
        span.classList.add("role");
        span.innerHTML = tag_dict['role']; 
        span.innerHTML += "  ";
        let icon_clone = icon.cloneNode();
        icon_clone.addEventListener("click", clear_tag) ;
        span.appendChild(icon_clone);
        filter.appendChild(span);
    }
    if ("level" in tag_dict){
        let span = document.createElement("span");
        span.classList.add("level");
        span.innerHTML = tag_dict['level'];
        span.innerHTML += "  ";
        let icon_clone = icon.cloneNode();
        icon_clone.addEventListener("click", clear_tag) ;
        span.appendChild(icon_clone);
        filter.appendChild(span)
    }
    if (tag_dict['language'].length > 0){
        for ( let la of tag_dict['language']){
            let span = document.createElement("span");
            span.classList.add("language");
            span.innerHTML = la;
            span.innerHTML += "  ";
            let icon_clone = icon.cloneNode();
            icon_clone.addEventListener("click", clear_tag) ;
            span.appendChild(icon_clone);
            filter.appendChild(span)
        }
    }
    if (tag_dict['tool'].length > 0){
        for ( let to of tag_dict['tool']){
            let span = document.createElement("span");
            span.classList.add("tool");
            span.innerHTML = to;
            span.innerHTML += "  ";
            let icon_clone = icon.cloneNode();
            icon_clone.addEventListener("click", clear_tag) ;
            span.appendChild(icon_clone);
            filter.appendChild(span)
        }
    }
    update_search_results()
}

function clear_tag(ev){
    // console.log("triggerd clear_tag")
    var el = ev.target;
    globalThis.e = ev.target;
    var type = undefined;
    type = el.parentElement.classList[0];
    // (el.dataset.role) ? {type = "role"}: type = undefined;
    // (el.dataset.level) ? {type = "level"}: type = undefined;
    // (el.dataset.languages) ? {type = "language"}: type = undefined;
    // (el.dataset.tools) ? {type = "tool"}: type = undefinedf;
    var str_tag = e.parentElement.innerText.match(/\w+/g)[0]

    // type and string is known from here on
    console.log(`Trying to delete ${type} - ${str_tag}`)
    
    if (type=="role" || type=="level"){
        delete tag_dict[type]
    }else { // language or tool
        let idx = tag_dict[type].indexOf(str_tag);
        tag_dict[type].splice(idx, 1);
    }


    console.log(tag_dict);    
    update_filter_bar();
    console.log("================================");  
}


function clear_search_bar(ev){
    while (filter.firstChild){
        filter.removeChild(filter.lastChild);
    }
    delete tag_dict.role;
    delete tag_dict.level;
    tag_dict.language = [];
    tag_dict.tool = [];
    update_search_results();
}


function update_search_results(){
    // check if job tags match the search
    for (var job of items){
        job.style.display = 'flex'; //asume the job shall be displayed as a starting point
        var job_desc = job.getElementsByClassName("job-description")[0];
        var name = job.getElementsByTagName("h1")[0].textContent;
        var tags = job.getElementsByClassName("tags")[0];
        var role_job = tags.getElementsByClassName("role")[0];
        role_job = role_job.dataset.role;
        var level_job = tags.getElementsByClassName("level")[0];
        level_job = level_job.dataset.level;
        var lang_job = tags.getElementsByClassName("language");
        var lang_job_list = [];
        for (var i=0; i < lang_job.length; i++){
            lang_job_list.push(lang_job[i].dataset.languages)
        }
        // console.log(`name:${name}\t-\trole:${role}\t-\tlevel: ${level}`)
        
        // compare job's role, level, languages and tools 
        // with the filter tags

        if (('role' in tag_dict) && (role_job != tag_dict['role'])){
            job.style.display = 'none';
            continue
        }
        if (('level' in tag_dict) && (level_job != tag_dict['level'])){
            job.style.display = 'none';
            continue
        }
        if (tag_dict['language'].length>0){ // filter for languages
            for (var lang_filt of tag_dict['language']){
                if ( lang_job_list.indexOf(lang_filt) == -1){
                    job.style.display = 'none';
                    continue 
                }
            }
        }
        // if (tag_dict[tool].length>0){ // filter for tools
            
        // }




    }

}
