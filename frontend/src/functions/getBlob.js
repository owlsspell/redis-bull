export default async function createLink(response) {

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL((blob))
    const link = document.createElement('a')
    link.href = downloadUrl;
    link.setAttribute('download', 'document.pdf')
    document.body.appendChild(link)
    link.click()
    link.remove()
}