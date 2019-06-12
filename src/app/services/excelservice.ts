import { Injectable } from '@angular/core';

@Injectable()
export class ExcelService {

  public letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 
                    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  constructor() { }

  getLetter(value){
    var letterBase26 = this.base26(value);
    var letter = "";
    for (var i = 0; i < letterBase26.length; i++) {
      letter +=this.letters[letterBase26[i]];
    }
    return letter;
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  base26(nb10, result = null){
    if(!result){
      result = [];
    }
    var n1 = nb10%26;
    var n2 = Math.floor(nb10/26);
    result.unshift(n1);
    if(n2 < 27){
      if(n2 != 0){
        result.unshift(n2 - 1);
      }
      return result;
    }
    else {
      return this.base26(n2 - 1, result);
    }
  }

}