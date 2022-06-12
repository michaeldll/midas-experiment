export async function fetchShaders(vertexPath: string, fragmentPath: string) {
    const vertex = await fetch(vertexPath)
        .then(result => result.text());
    const fragment = await fetch(fragmentPath)
        .then(result => result.text());
    return { vertex, fragment }
}