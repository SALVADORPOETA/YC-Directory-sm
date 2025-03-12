'use client'

import { useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import MDEditor from '@uiw/react-md-editor'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { formSchema } from '@/lib/validation'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createPitch } from '@/lib/actions'

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pitch, setPitch] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [link, setLink] = useState('')
  const router = useRouter()
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        pitch,
      }

      setTitle(formValues.title)
      setDescription(formValues.description)
      setCategory(formValues.category)
      setLink(formValues.link)

      await formSchema.parseAsync(formValues)
      const result = await createPitch(prevState, formData, pitch)

      if (result.status === 'SUCCESS') {
        toast.success('Your startup pitch has been created successfully')
        router.push(`/startup/${result._id}`)
      }
      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        setErrors(fieldErrors as unknown as Record<string, string>)

        toast.error('Please check your inputs and try again')

        return { ...prevState, error: 'Validation failed', status: 'ERROR' }
      }

      toast.error('An unexpected error has occurred')

      return {
        ...prevState,
        error: 'An unexpected error has occurred',
        status: 'ERROR',
      }
    }
  }
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL',
  })

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: 'hidden' }}
          textareaProps={{
            placeholder:
              'Briefly describe your idea and what problem it solves',
          }}
          previewOptions={{
            disallowedElements: ['style'],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit your Pitch'}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  )
}

export default StartupForm
