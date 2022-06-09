export const lists = [
    { name: '999 Club', val: '999' },
    { name: '10k Club', val: '10k' },
    { name: '100k Club', val: '100k' },
    { name: '3-Digit Palindromes', val: '3dp' },
    { name: '4-Digit Palindromes', val: '4dp' },
    { name: '5-Digit Palindromes', val: '5dp' },
    { name: '6-Digit Palindromes', val: '6dp' },
    { name: '999 Arabic', val: '999a' },
    { name: '10k Arabic', val: '10ka' },
    { name: '3-Digit Arabic Pals', val: '3dap' },
    { name: '4-Digit Arabic Pals', val: '4dap' },
    { name: '0xFF Hex Club', val: '0xff' },
    { name: '0xFFF Hex Club', val: '0xfff' },
    { name: '24h Club', val: '24h' }
];

export function getList(listName: string) {
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
            for (let i = 0; i < 16**2; i++) {
                content += '0x' + pad(i.toString(16), 2) + ' ';
            }
            break;
        case '999a':
            for(let i = 0; i<10; i++) {
                for(let j = 0; j<10; j++) {
                    for(let k = 0; k<10; k++) {
                        content += `${an[i]}${an[j]}${an[k]} `;
                    }
                }
            }
            break;
        case '10ka':
            for(let i = 0; i<10; i++) {
                for(let j = 0; j<10; j++) {
                    for(let k = 0; k<10; k++) {
                        for(let l = 0; l<10; l++) {
                            content += `${an[i]}${an[j]}${an[k]}${an[l]} `;
                        }
                    }
                }
            }
            break;
        case '3dap':
            for(let i = 0; i<10; i++) {
                for(let j = 0; j<10; j++) {
                    content += `${an[i]}${an[j]}${an[i]} `;
                }
            }
            break;
        case '4dap':
            for(let i = 0; i<10; i++) {
                for(let j = 0; j<10; j++) {
                    content += `${an[i]}${an[j]}${an[j]}${an[i]} `;
                }
            }
            break;
        case '0xfff':
            for (let i = 0; i < 16**3; i++) {
                content += '0x' + pad(i.toString(16), 3) + ' ';
            }
            break;
        case '24h':
            for (let i = 0; i < 24; i++) {
                for (let j = 0; j < 60; j++) {
                    content += `${pad(i, 2)}h${pad(j, 2)} `;
                }
            }
            break;
        
    }
    return content;
}

function pad(i: number | string, digits: number) {
    return (i+'').padStart(digits, '0');
}

let an = '٠١٢٣٤٥٦٧٨٩';