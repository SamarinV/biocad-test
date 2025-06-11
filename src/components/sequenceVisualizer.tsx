import { Alert, Box, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import colorScheme from '../constants/colorScheme'

interface Props {
	sequence: string
	highlightDifferencesWith?: string
}

export const SequenceVisualizer = ({ sequence, highlightDifferencesWith = '' }: Props) => {
	const [copied, setCopied] = useState(false)

	const handleMouseUp = () => {
		const selection = window.getSelection()?.toString().replace(/\s+/g, '') || ''
		if (selection) {
			navigator.clipboard.writeText(selection)
			setCopied(true)
		}
	}

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])
	return (
		<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
			{sequence.split('').map((char, i) => {
				const compareChar = highlightDifferencesWith[i] ?? null
				const isDifferent = compareChar !== null && char !== compareChar
				const bgColor = isDifferent ? '#f44336' : highlightDifferencesWith ? '#eee' : colorScheme[char] || '#eee'

				const style = {
					bgcolor: bgColor,
					color: isDifferent ? 'white' : 'inherit',
					px: 0.5,
					py: 0.2,
					borderRadius: 0.5,
					marginRight: 0.3,
					marginBottom: 0.3,
				}

				return (
					<Box key={i} component="span" sx={style}>
						{char}
					</Box>
				)
			})}
			<Snackbar
				open={copied}
				autoHideDuration={2000}
				onClose={() => setCopied(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert severity="success">Текст скопирован!</Alert>
			</Snackbar>
		</Box>
	)
}
