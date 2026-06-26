import{Aa as ee,Ea as te,f as q,h as J,j as G,l as Z,r as K,s as W,ua as X,va as _,xa as Y,za as D}from"./chunk-A4V2E6ML.js";import{Db as O,Eb as C,Fb as P,Gb as H,Mb as V,Na as h,Oa as L,Q as m,R as k,Ra as y,Ta as p,V as f,Za as S,aa as F,bc as E,d as i,db as l,eb as b,fb as w,ga as M,gb as x,hb as B,ib as j,jb as N,jc as U,kb as A,la as g,lb as z,r as s,tb as v,ub as Q,vb as R,wb as T,ya as c,yb as $,zb as I}from"./chunk-LNFWHHBU.js";var ne=["icon"],oe=["*"];function ie(e,u){if(e&1&&x(0,"span",4),e&2){let t=v(2);l("ngClass",t.icon)}}function se(e,u){if(e&1&&(A(0),p(1,ie,1,1,"span",3),z()),e&2){let t=v();c(),l("ngIf",t.icon)}}function ce(e,u){}function le(e,u){e&1&&p(0,ce,0,0,"ng-template")}function ge(e,u){if(e&1&&(b(0,"span",5),p(1,le,1,0,null,6),w()),e&2){let t=v();c(),l("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)}}var pe=({dt:e})=>`
.p-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${e("tag.primary.background")};
    color: ${e("tag.primary.color")};
    font-size: ${e("tag.font.size")};
    font-weight: ${e("tag.font.weight")};
    padding: ${e("tag.padding")};
    border-radius: ${e("tag.border.radius")};
    gap: ${e("tag.gap")};
}

.p-tag-icon {
    font-size: ${e("tag.icon.size")};
    width: ${e("tag.icon.size")};
    height:${e("tag.icon.size")};
}

.p-tag-rounded {
    border-radius: ${e("tag.rounded.border.radius")};
}

.p-tag-success {
    background: ${e("tag.success.background")};
    color: ${e("tag.success.color")};
}

.p-tag-info {
    background: ${e("tag.info.background")};
    color: ${e("tag.info.color")};
}

.p-tag-warn {
    background: ${e("tag.warn.background")};
    color: ${e("tag.warn.color")};
}

.p-tag-danger {
    background: ${e("tag.danger.background")};
    color: ${e("tag.danger.color")};
}

.p-tag-secondary {
    background: ${e("tag.secondary.background")};
    color: ${e("tag.secondary.color")};
}

.p-tag-contrast {
    background: ${e("tag.contrast.background")};
    color: ${e("tag.contrast.color")};
}
`,de={root:({props:e})=>["p-tag p-component",{"p-tag-info":e.severity==="info","p-tag-success":e.severity==="success","p-tag-warn":e.severity==="warn","p-tag-danger":e.severity==="danger","p-tag-secondary":e.severity==="secondary","p-tag-contrast":e.severity==="contrast","p-tag-rounded":e.rounded}],icon:"p-tag-icon",label:"p-tag-label"},ae=(()=>{class e extends Y{name="tag";theme=pe;classes=de;static \u0275fac=(()=>{let t;return function(r){return(t||(t=g(e)))(r||e)}})();static \u0275prov=m({token:e,factory:e.\u0275fac})}return e})();var ue=(()=>{class e extends ee{get style(){return this._style}set style(t){this._style=t,this.cd.markForCheck()}styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_style;_componentStyle=f(ae);ngAfterContentInit(){this.templates?.forEach(t=>{t.getType()==="icon"&&(this._iconTemplate=t.template)})}containerClass(){let t="p-tag p-component";return this.severity&&(t+=` p-tag-${this.severity}`),this.rounded&&(t+=" p-tag-rounded"),this.styleClass&&(t+=` ${this.styleClass}`),t}static \u0275fac=(()=>{let t;return function(r){return(t||(t=g(e)))(r||e)}})();static \u0275cmp=h({type:e,selectors:[["p-tag"]],contentQueries:function(a,r,n){if(a&1&&(T(n,ne,4),T(n,X,4)),a&2){let o;$(o=I())&&(r.iconTemplate=o.first),$(o=I())&&(r.templates=o)}},hostVars:4,hostBindings:function(a,r){a&2&&(O(r.style),C(r.containerClass()))},inputs:{style:"style",styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",U]},features:[V([ae]),y],ngContentSelectors:oe,decls:5,vars:3,consts:[[4,"ngIf"],["class","p-tag-icon",4,"ngIf"],[1,"p-tag-label"],["class","p-tag-icon",3,"ngClass",4,"ngIf"],[1,"p-tag-icon",3,"ngClass"],[1,"p-tag-icon"],[4,"ngTemplateOutlet"]],template:function(a,r){a&1&&(Q(),R(0),p(1,se,2,1,"ng-container",0)(2,ge,2,1,"span",1),b(3,"span",2),P(4),w()),a&2&&(c(),l("ngIf",!r.iconTemplate&&!r._iconTemplate),c(),l("ngIf",r.iconTemplate||r._iconTemplate),c(2),H(r.value))},dependencies:[Z,q,J,G,_],encapsulation:2,changeDetection:0})}return e})(),ke=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=L({type:e});static \u0275inj=k({imports:[ue,_,_]})}return e})();var d=`${D.apiUrl}/cars`,je=(()=>{class e{http=f(W);_cars=M([]);cars=this._cars.asReadonly();availableCars=E(()=>this._cars().filter(t=>t.status==="Disponible"));featuredCars=E(()=>this.availableCars().slice(0,3));constructor(){this.loadAll()}loadAll(){return i(this,null,function*(){try{let t=yield s(this.http.get(d));this._cars.set(t),this.saveToLocal(t)}catch(t){console.error("Error loading cars from API, using local cache:",t),this._cars.set(this.loadFromLocal())}})}getById(t){return i(this,null,function*(){try{return yield s(this.http.get(`${d}/${t}`))}catch(a){return console.error("Error fetching car:",a),this._cars().find(r=>r.id===t)||null}})}create(t){return i(this,null,function*(){try{let a=yield s(this.http.post(d,t));return this._cars.update(r=>[...r,a]),this.saveToLocal(this._cars()),a}catch(a){throw console.error("Error creating car:",a),this.handleError(a)}})}update(t,a){return i(this,null,function*(){try{let r=yield s(this.http.put(`${d}/${t}`,a));return this._cars.update(n=>n.map(o=>o.id===t?r:o)),this.saveToLocal(this._cars()),r}catch(r){throw console.error("Error updating car:",r),this.handleError(r)}})}delete(t){return i(this,null,function*(){try{yield s(this.http.delete(`${d}/${t}`)),this._cars.update(a=>a.filter(r=>r.id!==t)),this.saveToLocal(this._cars())}catch(a){throw console.error("Error deleting car:",a),this.handleError(a)}})}uploadImage(t){return i(this,null,function*(){try{let a=new FormData;return a.append("file",t),(yield s(this.http.post(`${D.apiUrl}/cars/upload`,a))).url}catch(a){return console.error("Error uploading image, falling back to base64:",a),yield this.toBase64(t)}})}getByStatus(t){return this._cars().filter(a=>a.status===t)}search(t){let a=t.toLowerCase().trim();return a?this._cars().filter(r=>r.brand.toLowerCase().includes(a)||r.model.toLowerCase().includes(a)||r.version?.toLowerCase().includes(a)||r.tags?.some(n=>n.toLowerCase().includes(a))):this._cars()}getBrands(){return[...new Set(this._cars().map(t=>t.brand))]}clearCache(){localStorage.removeItem("valverde_cars")}saveToLocal(t){try{localStorage.setItem("valverde_cars",JSON.stringify(t))}catch{}}loadFromLocal(){try{let t=localStorage.getItem("valverde_cars");return t?JSON.parse(t):[]}catch{return[]}}toBase64(t){return new Promise((a,r)=>{let n=new FileReader;n.onload=()=>a(n.result),n.onerror=()=>r(new Error("Error reading file")),n.readAsDataURL(t)})}handleError(t){if(t instanceof K){let a=t.error?.message||t.message||"Error en el servidor";return new Error(a)}return t instanceof Error?t:new Error("Error desconocido")}static \u0275fac=function(a){return new(a||e)};static \u0275prov=m({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})();var Qe=(()=>{class e extends te{static \u0275fac=(()=>{let t;return function(r){return(t||(t=g(e)))(r||e)}})();static \u0275cmp=h({type:e,selectors:[["ChevronDownIcon"]],features:[y],decls:2,vars:5,consts:[["width","14","height","14","viewBox","0 0 14 14","fill","none","xmlns","http://www.w3.org/2000/svg"],["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(a,r){a&1&&(F(),B(0,"svg",0),N(1,"path",1),j()),a&2&&(C(r.getClassNames()),S("aria-label",r.ariaLabel)("aria-hidden",r.ariaHidden)("role",r.role))},encapsulation:2})}return e})();export{Qe as a,ue as b,ke as c,je as d};
