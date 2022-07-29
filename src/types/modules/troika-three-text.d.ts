declare module "troika-three-text" {
    class Text {
        public text: string
        public position
        public rotation
        public scale
        public geometry
        public material
        public visible: boolean
        add(object3d): void
        constructor(geometry, material)
        sync(): void;
    }

    function preloadFont(props: { font: string, characters: string, sdfGlyphSize?: number }, callback: () => void): void
}