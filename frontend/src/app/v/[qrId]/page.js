import PublicSticker from '../../../views/PublicSticker'

export function generateStaticParams() {
  return [{ qrId: 'preview' }]
}

export default function Page() {
  return <PublicSticker />
}
