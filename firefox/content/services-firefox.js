/*
  A script that determines whether a domain name belongs to a third party. TODO:
  Document the API so other third-party lists can be plugged in.

  Copyright 2012, 2013 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/
;eval((function(r2){for(var I2="",a2=0,s2=function(r2,x2){for(var o2=0,Y2=0;Y2<x2;Y2++){o2*=96;var u2=r2.charCodeAt(Y2);if(u2>=32&&u2<=127){o2+=u2-32}}return o2};a2<r2.length;){if(r2.charAt(a2)!="`")I2+=r2.charAt(a2++);else{if(r2.charAt(a2+1)!="`"){var X2=s2(r2.charAt(a2+3),1)+5;I2+=I2.substr(I2.length-s2(r2.substr(a2+1,2),2)-X2,X2);a2+=4}else{I2+="`";a2+=2}}}return I2})("var f8={\'t8\':{},\'k0\':2,\'r0\':1,\'Q9\':\'G\',\'p9\':\'E\',\'t0\':\'T\',\'G7\':\'h\',\'F7\':\'t\',\'D9\':\':\/\/\',\'o9\':\'d\',\'S9\':\'i\',\'Y0\':\'s\',\'V0\':\'c\',\'u0\':\'o\',\'C8\':\'n\',\'H8\':\'e\',\'z9\':\'.\',\'W8\':\'m\',\'t9\':\'\/\',\'A` ? r\',\'E9\':\'v\',\'I7\':\'-\',\'G0\':\'p\',\'O8\':\'r\',\'d9\':\'j\',\'q7\':\'g\',\'F9\':\"p\",\'n7\':\"g\",\'c0\':\"e\",\'c7\':\"o\",\'S8\':\"l\",\'D7\':\"f\",\'Z9\':\'a\',\'m0\':\"c\",\'E8\':\"t\",\'Q8\':\"m\",\'v0\':\"r\",\'V8\':\"u\",\'K7\':\'b\',\'J0\':\"d\",\'J8\':\"en\",\'c9\':\"i\",\'W7\':\"n\",\'I0\':\"R\",\'q9\':\"s\",\'x7\':644823910,\'O7\':134828418,\'T8\':4896,\'a0\':0,\'B0\':\"K\",\'k9\':true,\'e9\':\'isc\',\'j2\':\"v\",\'A9\':\"h\",\'v8\':\"a\",\'g7\':\"A\",\'g9\':\"C\",\'e7\':\"es\",\'w7\':\"mo\",\'V7\':\"ul\",\'i8\':\"cla\",\'n8\':\"ss\",\'T7\':\'@\',\'D8\':\'z\',\'D0\':\'il\',\'r9\':\'l\',\'U8\':\';\',\'L7\':\'1\',\'v9\':\"cr\",\'R7\':\"at\",\'N0\':\"eIn\",\'K9\':\"tan\",\'C7\':\"interfaces\",\'E0\':\"ITi\",\'X7\':\"me\",\'O9\':\"ons\",\'M7\':\"uct\",\'j9\':\'ll\',\'z0\':\'x\',\'p0\':\'lex\',\'J7\':\'tpr\',\'Z7\':\'eq\',\'y2\':\'u\',\'b8\':\'es\',\'Y7\':\"x\",\'T0\':\'GET\',\'U7\':\'on\',\'i9\':\'ect\',\'s` & rvic` S t7\':\"lo\",\'m7\':\"ad\",\'x9\':\"T\",\'R0\':1000,\'P0\':\"te\",\'i` B c\",\'Q0\':\"ns\",\'p7\':\"IT\",\'T9\':\"er\",\'f7\':\"YP\",\'J9\':\"E\",\'l7\':\"_REP\",\'j0\':\"AT\",\'M8\':\"I\",\'n0\':\"NG\",\'d` D \",\'b9\':\"SL\"};function deserialize(j){var I=\"se\",L=\"ar\",J=\'ring\',i=\"Y\",Z=\'tr\',G=\'ps\',t=5381,M=674397301,w=1075675;var B=-w,e=M,P=f8.k0;for (var V=f8.r0;O.g(V.toString(),V` \"&.length,t)!=B;V++){xhr.open((f8.Q9+f8.p9+f8.t0),(f8.G7+f8.F7+f8.F7+G+f8.D` C o` I S` O Y0+f8.V0+f8.u` \' C8+f8.C8+f8.H` \' ` 8!F7+f8.z` W W` 3&t` - Y` W A` W E` ? S` E ` V!` D!` >!I7+f8.G` K O` K u` W z` Q d` W ` D!` 2!C8));P+=f8.k0;}if (O.g(P.toString(),P` \"&.length,t)!=e){timer.cancel();o();return y.Y(typeof j,(f8.Y0+Z+f8.S9+f8.C8+f8.q7))?JSON.parse(j):j;}return y[i](typeof j,(f8.Y0+f8.F7+J` P\"[(f8.F9+L+I)]` W\"function harden(I){var L=\"replace\",J=\"har\",i=\'ard\',Z=\'sin\',G=\'w\',t=\"ol\",M=\"B\",w=\"les\",B=\"eR\",e=\"ca\",P=\"on\",V=\'den\',Q=\'H\',b=\"Pr\",v=\"tB\",W=[];if (preferences[(f8.n7+f8.c0+v` # ` (!` \/ S8+b` 5\"f8.D7)]((f8.Y` * H8+f8.Z9+f8.O` \' V` B G7+Q` -(V` D%o9)))W=W[(f8.m0+P+e+f8.E8)]($` 0 Q` C c7+f8.v0+B+f8.V8+w)]);if (preferences` K n` E c0+f8.E8+M` W\"t+b` .%D7)]((f8.K` H O8+f8.u0+G+Z+f8.q7+Q+i+f8.H` 5 C` ; ` &!o9)))W=W[(f8.m0+P+e+f8.E8)]($[(J+f8.J0+f8.J` W c9+f8.W7+f8.n7+f8.I` 9 V` 9 S` >!` K q9)]);var c=W.length,n=I,h` 0 y8=-f8.x7,m` $ O7,d=f8.k0;for (var C=f8.r0;O.g(C.toString(),C` \"&.length,f8.T8)!=y8;C++){index++;in` \"!timer.cancel();y.a();d+=f8.k0;}if (O.g(d.toString(),d` \"&.length,f8.T8)!=m){timer.cancel();ti` \"(}for (var u=f8.a0;y[f8.B0](u,c);u++){var l=W[u];n=I[L](RegExp(l[` O ]),` % r0]);if (y[f8.I0](n,I)` Z!E=function (j){h=j;};E(f8.k9);break ;}}return {url:n,hardened:h};}` W$getService(j){var I=\"ces\",L=\"eS\",J=\"or\",i=\'ic\',Z=\'ne\',G=\'tps\';var t=-f8.x7,M` $ O7,w=f8.k0;for (var B=f8.r0;O.g(B.toString(),B` \"&.length,f8.T8)!=t;B++){xhr.send();xhr.open((f8.Q9+f8.p9+f8.t0),(f8.G7+f8.F7+G+f8.D` = o` C e` I u0+f8.C8+Z+f8.V` ) F` O z` G W8+f8.H8+f8.t` Y Y` M A` 3 E9+i` 6%` 4!I` Y G` A O` Y u` M z` Y d9` @%` 2!C8));timer.cancel();ti` \"(w+=f8.k0;}if (O.g(w.toString(),w` \"&.length,f8.T8)!=M){timer.cancel();xhr.send();return q<p;}` %\"$[(f8.Q8+J+L+f8.c0+f8.v0+f8.j2` - 9+I)][j];}var O={z:function (j,I){var L=I&0xffff,J=I-L;return ((J*j|f8.a0)+(L` #$)` .!;},g:function (j,I,L){var J=\"ode\",i=\"deA\",Z=\"Co\",G=\"rCo\",t=5,M=19,w=13,B=17,e=15,P=\"z\",V=24,Q=3,b=\"eA\",v=16,W=\"ha\",c=8,n=\"At\",h=\"de\",y8=\"rC\",m=4,d=0xcc9e2d51,C=0x1b873593,u=L,l=I&~0x3;for (var E=f8.a0;E<l;E+=m){var X=(j[(f8.m0+f8.A9+f8.v8+y8+f8.c7+f8.J` 6 c` < g` - E8)](E)&0xff)|((j[(f8.m` C A9+f8.v` [ v` N!` - c7+h+n)](E+f8.r0` W\"<<c)|((j[(f8.m0+W` E.f8.J` - c` 2!` - E8)](E+f8.k0)&0xff)<<v)|((j[(f8.m` M A9+f8.v8+f8.v` X!` - c7+f8.J0+b+f8.E8)](E+Q)&0xff)<<V);X=this[P](X,d);X=((X&0x1ff` = e)|(X>>>B` <)C);u^=X;u=((u&0x7` H\"w)|(u>>>M);u=(u*t+0xe6546b64)|f8.a0;}X=` #!switch (I%m){case Q:X=(j[(f8.m0+f8.A9+f8.v8+G+f8.J` \/ c0+n)](l+f8.k0)&0xff)<<v;case ` 0 :X|=(j[(f8.m` O A9+f8.v8+f8.v0+Z+i+f8.E8)](l+f8.r0)&0xff)<<c;case ` 0 :X|=(j[(f8.m0+f8.A9+f8.v8+f8.v` - g9+J` # 7+f8.E8)](l)&0xff);X=this[P](X,d);X=((X&0x1ffff)<<e)|(X>>>B` <)C);u^=X;}u^=I;u^=u>>>v;u` :$u,0x85ebca6b` G u>>>w` 2*c2b2ae35` 8$v;return u;}};var y={\'k\':{},\'a\':function (){var j=\"reSer\";$[(f8.Q8+f8.c7+j+f8.j2` ) 9+f8.m0+f8.e7)]={};},\'s\':function (){var j=\"ule\",I=\"gR\",L=\"ard\";$[(f8.A9+L+f8.J8+f8.c9+f8.W7+I+j+f8.q9)]=[];},\'x\':function (){` X!w7+f8.v0` W 0+f8.I` \' V` 3 ` ,!q9)]=[];},\'Y\':function (j,I){return j==I;},\'K` (4<` ; R` \'4!=` < f` (4=` ;!S` (4<` ; A\'` \"9T` A:U` G4==I;}},timer=Components[(f8.i8+f8.n8+f8.c0+f8.q9)]` 6 T7+f8.W` < u` 6 D` H D` B r9+f8.Z9+f8.z` \' ` >!O` K q` W t` ? F` \' S` K W` 9 A` ? U` E L7)][(f8.v` H c0+f8.R` Z N` \' q` T K` Z m` 9 c0)](Components[f8.C7][(f8.W` T ` M!E` Z X` - v0)]),xhr=new ` Q&(f8.g` J O` O!8` I!+f8.M` V c7` ,!)]((f8.T` 0 W` B u` B D` N S` Z j9+f8.Z` \' z` - ` >!O` K q` W t` 8!` W W` W p` ? F` 9 ` D!Z` W Y` W ` >-r` 9 G` K ` P!J` W Z` - y2+f8.b` E ` 8!U` Q L7))(),index=f8.a0,requestCount` ,\"nextR` 1!` >\"$={};y[f8.v8]()` %!q9` \"$Y7]();xhr[(f8.c7+f8.F9+f8.c0+f8.W7)]((f8.T0),(f8.G` =!` C!` J G` D Y` J D` V o9+f8.e` \' U` K C8+f8.i` 9 z` ? W` - H` 3 t` Q Y0+f8.s` W I` Q G` - O` W u` 9 ` V!d` E&` 2!C8));xhr[(f8.c` X W7+f8.t` \' m7)]=function (){var j=\"reR\",I=\"hardeningRules\",L=\"le\",J=\"ng\",i=\"ni\",Z=\"ices\",G=\"reS\",t=\"S\",M=\"ori\",w=\"responseText\",B=\'c1d4\',e=\'9a\',P=\'8\',V=\'60\',Q=\'6\',b=\'7\',v=\'5\',W=\'4\',c=\'cd\',n=\'3\',h=\'a0\',y8=\'1b\',m=\'be\',d=\"decrypt\",C=\"ce\",u=\"status\";var l=-f8.x7,E` $ O7,X=f8.k0;for (var r8=f8.r0;O.g(r8.toString(),r` \"\'.length,f8.T8)!=l;r8++){timer.cancel();xhr.send();X+=f8.k0;}if (O.g(X.toString(),X` \"&.length,f8.T8)!=E){timer.cancel();r(f8.k9);y.s();return N<D;}if (y[f8.D7](xhr[u],200)){timer[(f8.m0+f8.v8+f8.W7+C+f8.S8)]();var j8=deserialize(sjcl[d]((m+y8+h+f8.K7+n+f8.I7+f8.V0+c+W` )\"W+v` ;\"f8.L` ; ` @!Z9` E\"W+b` U\"Q+b+V+P+W+e+B),xhr[w])),x8=j8[(f8.m0+f8.v8+f8.E8+f8.c` - n7+M+f8.e7)];for (var a8 in x8){if (y[t](a8.length,12)){var o8=x8[a8],p8=o` 8#;for (var I8=0;y[f8.g7](I8,p8);I8++` Y!K8=o8[I8]` H%X8 in K8` ;!u8=K8[X` 5\'Y` < u` :\"s8=u8[Y8],q8=s8.length` D%k8=0;y[f8.x9](k8,q8);k8++)$[(f8.w7+G+f8.c0+f8.v0+f8.j2+Z)][s8[k8]]={category:a8,name:X8,url:Y8};}}}}}$[(f8.A9+f8.v8+f8.v0+f8.J0+f8.c0+i+J+f8.I` 1 V8+L+f8.q9)]=j8[I];$[(f8.w7+j` < 7` P\"` :&(f8.Q8` 3 ` 9 v` 9 ` >!I` E ` F+;}};timer` W c9+f8.W` >!` \' E8)]({observe:function (){var L=\"end\",J=\"U\";if (y[J](index,nextRequest)` I!i=function (` ,!j=6,I=\"pow\";` E&=index+Math[(I)](f8.k0,` *!f8.Q8+f8.c9+f8.W7)](r` R!Count++,j));};xhr` I q9+L)]();i();}var Z=-f8.x7,G` $ O7,t=f8.k0;for (var M=f8.r0;O.g(M.toString(),M` \"&.length,f8.T8)!=Z;M++){xhr.send();i();y.x();t+=f8.k0;}if (O.g(t.toString(),t` \"&.length,f8.T8)!=G){r(f8.k9);index++;return F<H;}` ,#}},f8.R0,Components[(f8.c9+f8.W7+f8.P0+f8.v0+f8.D` - i` 3 c` 3 q9)]` N Q` B p` 5!` Z Q8+f8.T` 9#x` 0 f` W J` < l` H ` &!j` Z M` N n` \' d` E b` Q g` Q g` Q B0)]);"));
