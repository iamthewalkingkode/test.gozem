export const apiBaseURL = 'https://test-gozem-api.thewalkingkode.com';

export const copyObject = (data: any) => JSON.parse(JSON.stringify(data));

export const randCode = (length = 6) => {
    var result = '';
    var characters = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const ucFirst = (str: string) => str ? str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1) : '';

export const ucWords = (str: string) => str ? str.split(' ').map(str => { return ucFirst(str); }).join(' ') : '';

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then((_) => {
        console.log(text)
    });
}