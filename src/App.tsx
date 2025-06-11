import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SequenceVisualizer } from './components/sequenceVisualizer'

const formSchema = z
	.object({
		seq1: z
			.string()
			.min(1, 'Это поле обязательно')
			.regex(/^[ARNDCEQGHILKMFPSTWYV-]+$/i, { message: 'Недопустимые символы в последовательности 1' }),
		seq2: z
			.string()
			.min(1, 'Это поле обязательно')
			.regex(/^[ARNDCEQGHILKMFPSTWYV-]+$/i, { message: 'Недопустимые символы в последовательности 2' }),
	})
	.refine((data) => data.seq1.length === data.seq2.length, {
		path: ['seq2'],
		message: 'У последовательностей разная длина',
	})

type FormSchema = z.infer<typeof formSchema>

function App() {
	const {
		register,
		handleSubmit,
		watch,
		setFocus,
		trigger,
		formState: { errors },
	} = useForm<FormSchema>({ resolver: zodResolver(formSchema), mode: 'onChange' })

	const [result, setResult] = useState<FormSchema | null>(null)

	const onSubmit = (data: FormSchema) => {
		setResult(data)
	}

	const seq1 = watch('seq1') ?? ''
	const seq2 = watch('seq2') ?? ''

	useEffect(() => {
		setFocus('seq1')
	}, [])

	useEffect(() => {
		if (seq2) {
			trigger('seq2')
		}
	}, [seq1])

	useEffect(() => {
		result !== null && setResult(null)
	}, [seq1, seq2])

	return (
		<Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<TextField
					label="Последовательность 1"
					variant="outlined"
					fullWidth
					margin="normal"
					{...register('seq1')}
					error={!!errors.seq1}
					helperText={errors.seq1?.message}
					inputProps={{ style: { textTransform: 'uppercase' } }}
				/>

				<TextField
					label="Последовательность 2"
					variant="outlined"
					fullWidth
					margin="normal"
					{...register('seq2')}
					error={!!errors.seq2}
					helperText={errors.seq2?.message}
					inputProps={{ style: { textTransform: 'uppercase' } }}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={!!errors.seq1 || !!errors.seq2}
					sx={{ mt: 2 }}
				>
					Визуализировать
				</Button>
			</form>

			{result && (
				<Box
					sx={{
						mt: 4,
						fontFamily: 'monospace',
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
						minHeight: 60,
					}}
				>
					<SequenceVisualizer sequence={seq1.toUpperCase()} />
					<SequenceVisualizer sequence={seq2.toUpperCase()} highlightDifferencesWith={seq1.toUpperCase()} />
				</Box>
			)}
		</Box>
	)
}

export default App
