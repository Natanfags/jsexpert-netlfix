class Network {
    constructor({ host })  {
        this.host = host
    }

    parseManifestUrl({ url, fileResolution, fileResolutionTag, hostTag }) {
        return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
    }

    async fetchFile(url) {
        const response = await fetch(url)
        return response.arrayBuffer()
    }

    async getProperResolution(url) {
        const startMs = Date.now()
        const response = await fetch(url)
        await response.arrayBuffer()
        const endMs = Date.now()
        const durationInMs = (endMs - startMs)
        console.log('durationInMs', durationInMs);

        //ao inves de calcular tronghput, calcular duracao
        const resolutions = [
            //pior cenario, 20 segundos
            { start: 3001, end: 20000, resolution:144},
            // ate 3 segunds
            { start: 901, end: 3000, resolution:360},
            // menos de 1 segundo
            { start: 0, end: 900, resolution:720},
        ]

        const item = resolutions.find(item => {
            return item.start <= durationInMs && item.end >= durationInMs
        })

        const LOWEST_RESOLUTION = 144
        //se for mais de 30s
        if(!item) return LOWEST_RESOLUTION
        
        return item.resolution
    }
}