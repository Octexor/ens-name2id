export type ListItem = {name: string, val: string, closeOnSelect?: boolean};
type ListObj = {name: string, subItems: ListItem[]};
export const lists: {[val: string]: ListObj} = {
    'wd': {
        name: 'Western Digits', subItems: [
            { name: '999 Club', val: '999' },
            { name: '10k Club', val: '10k' },
            { name: '100k Club', val: '100k' },
            { name: '3-Digit Palindromes', val: '3dp' },
            { name: '4-Digit Palindromes', val: '4dp' },
            { name: '5-Digit Palindromes', val: '5dp' },
            { name: '6-Digit Palindromes', val: '6dp' },    
        ]
    },
    'ad': {
        name: 'Arabic Digits', subItems: [
            { name: '999 Arabic Club', val: '999a' },
            { name: '10k Arabic Club', val: '10ka' },
            { name: '100k Arabic Club', val: '100ka' },
            { name: '3-Digit Arabic Palindromes', val: '3dap' },
            { name: '4-Digit Arabic Palindromes', val: '4dap' },
            { name: '5-Digit Arabic Palindromes', val: '5dap' },
            { name: '6-Digit Arabic Palindromes', val: '6dap' },
        ]
    },
    'pd': {
        name: 'Persian Digits', subItems: [
            { name: '999 Persian Club', val: '999p' },
            { name: '10k Persian Club', val: '10kp' },
            { name: '100k Persian Club', val: '100kp' },
            { name: '3-Digit Persian Palindromes', val: '3dpp' },
            { name: '4-Digit Persian Palindromes', val: '4dpp' },
            { name: '5-Digit Persian Palindromes', val: '5dpp' },
            { name: '6-Digit Persian Palindromes', val: '6dpp' },
        ]
    },
    'id': {
        name: 'Indic Digits', subItems: [
            { name: '999 Indic Club', val: '999i' },
            { name: '10k Indic Club', val: '10ki' },
            { name: '100k Indic Club', val: '100ki' },
            { name: '3-Digit Indic Palindromes', val: '3dip' },
            { name: '4-Digit Indic Palindromes', val: '4dip' },
            { name: '5-Digit Indic Palindromes', val: '5dip' },
        ]
    },
    'hd': {
        name: 'Hex Digits', subItems: [
            { name: '0xFF Hex Club', val: '0xff' },
            { name: '0xFFF Hex Club', val: '0xfff' },
        ]
    },
    '24h': {
        name: '24h Club', subItems: [
            { name: '24h Club', val: '24hc' },
            { name: '24h Palindromes', val: '24hp' }
        ]
    },
};

export function getList(listName: string): Promise<string> {
    return new Promise((resolve, _) => {
        setTimeout(() => {

            let content = '';
            switch (listName) {
                case '999':
                    for (let i = 0; i < 1000; i++) {
                        content += pad(i, 3) + ' ';
                    }
                    break;
                case '10k':
                    for (let i = 0; i < 10000; i++) {
                        content += pad(i, 4) + ' ';
                    }
                    break;
                case '100k':
                    for (let i = 0; i < 100000; i++) {
                        content += pad(i, 5) + ' ';
                    }
                    break;
                case '3dp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${i}${j}${i} `;
                        }
                    }
                    break;
                case '4dp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${i}${j}${j}${i} `;
                        }
                    }
                    break;
                case '5dp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${i}${j}${k}${j}${i} `;
                            }
                        }
                    }
                    break;
                case '6dp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${i}${j}${k}${k}${j}${i} `;
                            }
                        }
                    }
                    break;
                case '0xff':
                    for (let i = 0; i < 16 ** 2; i++) {
                        content += '0x' + pad(i.toString(16), 2) + ' ';
                    }
                    break;
                case '999a':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${an[i]}${an[j]}${an[k]} `;
                            }
                        }
                    }
                    break;
                case '10ka':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                for (let l = 0; l < 10; l++) {
                                    content += `${an[i]}${an[j]}${an[k]}${an[l]} `;
                                }
                            }
                        }
                    }
                    break;
                case '100ka':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                for (let l = 0; l < 10; l++) {
                                    for (let m = 0; m < 10; m++) {
                                        content += `${an[i]}${an[j]}${an[k]}${an[l]}${an[m]} `;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case '3dap':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${an[i]}${an[j]}${an[i]} `;
                        }
                    }
                    break;
                case '4dap':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${an[i]}${an[j]}${an[j]}${an[i]} `;
                        }
                    }
                    break;
                case '5dap':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${an[i]}${an[j]}${an[k]}${an[j]}${an[i]} `;
                            }
                        }
                    }
                    break;
                case '6dap':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${an[i]}${an[j]}${an[k]}${an[k]}${an[j]}${an[i]} `;
                            }
                        }
                    }
                    break;
                case '999p':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${pn[i]}${pn[j]}${pn[k]} `;
                            }
                        }
                    }
                    break;
                case '10kp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                for (let l = 0; l < 10; l++) {
                                    content += `${pn[i]}${pn[j]}${pn[k]}${pn[l]} `;
                                }
                            }
                        }
                    }
                    break;
                case '100kp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                for (let l = 0; l < 10; l++) {
                                    for (let m = 0; m < 10; m++) {
                                        content += `${pn[i]}${pn[j]}${pn[k]}${pn[l]}${pn[m]} `;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case '3dpp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${pn[i]}${pn[j]}${pn[i]} `;
                        }
                    }
                    break;
                case '4dpp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${pn[i]}${pn[j]}${pn[j]}${pn[i]} `;
                        }
                    }
                    break;
                case '5dpp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${pn[i]}${pn[j]}${pn[k]}${pn[j]}${pn[i]} `;
                            }
                        }
                    }
                    break;
                case '6dpp':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${pn[i]}${pn[j]}${pn[k]}${pn[k]}${pn[j]}${pn[i]} `;
                            }
                        }
                    }
                    break;
                case '999i':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${indic[i]}${indic[j]}${indic[k]} `;
                            }
                        }
                    }
                    break;
                case '10ki':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                for (let l = 0; l < 10; l++) {
                                    content += `${indic[i]}${indic[j]}${indic[k]}${indic[l]} `;
                                }
                            }
                        }
                    }
                    break;
                case '100ki':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                for (let l = 0; l < 10; l++) {
                                    for (let m = 0; m < 10; m++) {
                                        content += `${indic[i]}${indic[j]}${indic[k]}${indic[l]}${indic[m]} `;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case '3dip':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${indic[i]}${indic[j]}${indic[i]} `;
                        }
                    }
                    break;
                case '4dip':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            content += `${indic[i]}${indic[j]}${indic[j]}${indic[i]} `;
                        }
                    }
                    break;
                case '5dip':
                    for (let i = 0; i < 10; i++) {
                        for (let j = 0; j < 10; j++) {
                            for (let k = 0; k < 10; k++) {
                                content += `${indic[i]}${indic[j]}${indic[k]}${indic[j]}${indic[i]} `;
                            }
                        }
                    }
                    break;
                case '0xfff':
                    for (let i = 0; i < 16 ** 3; i++) {
                        content += '0x' + pad(i.toString(16), 3) + ' ';
                    }
                    break;
                case '24hc':
                    for (let i = 0; i < 24; i++) {
                        for (let j = 0; j < 60; j++) {
                            content += `${pad(i, 2)}h${pad(j, 2)} `;
                        }
                    }
                    break;
                case '24hp':
                    for (let i = 0; i < 24; i++) {
                        const min = pad(i, 2).split('').reverse().join('');
                        if(Number(min) < 60) {
                            content += `${pad(i, 2)}h${pad(i, 2).split('').reverse().join('')} `;
                        }
                    }
                    break;
            }

            resolve(content);
        }, 100);
    });
}

function pad(i: number | string, digits: number) {
    return (i + '').padStart(digits, '0');
}

let an = '٠١٢٣٤٥٦٧٨٩';
let pn = '٠١٢٣۴۵۶٧٨٩';
let indic = '०१२३४५६७८९'; // devanagari