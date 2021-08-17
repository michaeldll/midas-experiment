export class OBJLoader {
    async load(url: string) {
        const response = await fetch(url)
        const textContent = await response.text()
        return textContent
    }

    parse(text: string) {
        const keywords = {
        };

        const keywordRegex = /(\w*)(?: )*(.*)/;
        const lines = text.split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRegex.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
                console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
                continue;
            }
            handler(parts, unparsedArgs);
        }
    }
}