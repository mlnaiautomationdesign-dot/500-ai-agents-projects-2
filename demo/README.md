# Hosting and Embedding Agent Demos

This guide explains how to host interactive demos for your AI agents and embed them in the platform.

## Hosting Options

### Option 1: Gradio on Hugging Face Spaces (Recommended)

Gradio is the easiest way to create and host interactive ML demos.

#### Step 1: Create a Gradio Interface

```python
# app.py
import gradio as gr

def your_agent_function(input_text):
    # Your agent logic here
    result = process_input(input_text)
    return result

demo = gr.Interface(
    fn=your_agent_function,
    inputs=gr.Textbox(label="Input"),
    outputs=gr.Textbox(label="Output"),
    title="Your Agent Demo",
    description="Description of your agent"
)

if __name__ == "__main__":
    demo.launch()
```

#### Step 2: Deploy to Hugging Face Spaces

1. Create a new Space at [huggingface.co/new-space](https://huggingface.co/new-space)
2. Choose "Gradio" as the SDK
3. Upload your code or connect to a Git repository
4. The Space will be automatically deployed

#### Step 3: Get the Embed URL

Your embed URL will be: `https://huggingface.co/spaces/USERNAME/SPACE_NAME`

### Option 2: Streamlit Cloud

Streamlit is great for data-focused applications and dashboards.

#### Step 1: Create a Streamlit App

```python
# streamlit_app.py
import streamlit as st

st.title("Your Agent Demo")

input_text = st.text_input("Enter your input:")

if st.button("Process"):
    result = your_agent_function(input_text)
    st.write(result)
```

#### Step 2: Deploy to Streamlit Cloud

1. Push your code to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Connect your GitHub repository
4. Deploy the app

#### Step 3: Get the Embed URL

Your URL will be: `https://USERNAME-APPNAME-RANDOMSTRING.streamlit.app`

### Option 3: Custom Hosting

If you have a custom web app, deploy it on:

- **Vercel**: Great for Next.js and React apps
- **Netlify**: Good for static sites and serverless functions
- **Heroku**: Traditional hosting with Docker support
- **AWS/GCP/Azure**: Full control and scalability

#### CORS Configuration

For iframe embedding to work, your demo must allow CORS:

**Express.js example:**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-platform-domain.com');
  res.header('X-Frame-Options', 'ALLOW-FROM https://your-platform-domain.com');
  next();
});
```

**Nginx example:**
```nginx
add_header X-Frame-Options "ALLOW-FROM https://your-platform-domain.com";
add_header Access-Control-Allow-Origin "https://your-platform-domain.com";
```

## Embedding in the Platform

### Step 1: Add Demo Configuration

Edit `pages/demo/[agent].tsx`:

```typescript
const agentDemoInfo: Record<string, { title: string; description: string; embedUrl?: string }> = {
  'your-agent-id': {
    title: 'Your Agent Name',
    description: 'Your agent description',
    embedUrl: 'https://your-demo-url.com', // Add your hosted demo URL
  },
};
```

### Step 2: Test the Embed

1. Run the development server: `npm run dev`
2. Navigate to `/demo/your-agent-id`
3. Verify the demo loads correctly in the iframe

### Step 3: Adjust Iframe Settings (if needed)

If your demo requires specific dimensions or settings:

```typescript
<iframe
  src={agentInfo.embedUrl}
  className="w-full"
  style={{ height: '800px', border: 'none' }} // Adjust height as needed
  title={`${agentInfo.title} Demo`}
  allow="camera; microphone" // Add any required permissions
/>
```

## Best Practices

### Performance
- Keep demos lightweight and fast-loading
- Show loading states
- Cache results when possible

### User Experience
- Provide clear instructions within the demo
- Show example inputs/outputs
- Handle errors gracefully with user-friendly messages

### Security
- Don't expose API keys or secrets in client-side code
- Implement rate limiting to prevent abuse
- Validate all user inputs

### Accessibility
- Use proper ARIA labels
- Ensure keyboard navigation works
- Provide text alternatives for visual content

## Examples

### Gradio Examples
- **Text Classification**: [Example Space](https://huggingface.co/spaces/example/text-classifier)
- **Image Generation**: [Example Space](https://huggingface.co/spaces/example/image-gen)

### Streamlit Examples
- **Data Dashboard**: [Example App](https://streamlit.io/gallery)
- **ML Model Interface**: [Example App](https://streamlit.io/gallery)

## Troubleshooting

### Demo Not Loading
- Check CORS settings
- Verify the URL is accessible
- Check browser console for errors

### Slow Performance
- Optimize model loading
- Use caching
- Consider serverless/edge deployment

### Iframe Issues
- Some platforms block iframe embedding by default
- Check X-Frame-Options headers
- Consider using postMessage API for communication

## Resources

- [Gradio Documentation](https://gradio.app/docs)
- [Streamlit Documentation](https://docs.streamlit.io)
- [Hugging Face Spaces Guide](https://huggingface.co/docs/hub/spaces)
- [Vercel Deployment](https://vercel.com/docs)

## Need Help?

Contact support at support@example.com or check the community forum.
