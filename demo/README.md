# Agent Demo Hosting Guide

This guide explains how to host and embed demos for your AI agents using popular platforms.

## Overview

AI agent demos can be hosted on various platforms and embedded into the marketplace using iframes. The recommended platforms are:

1. **Gradio** - Python-based interactive ML demos
2. **Streamlit** - Python web apps for data science
3. **HuggingFace Spaces** - Hosted ML demos and apps

## Option 1: Gradio

Gradio is perfect for ML model demos with minimal code.

### Setup

1. Install Gradio:
```bash
pip install gradio
```

2. Create your demo (`app.py`):
```python
import gradio as gr

def process(input_text):
    # Your agent logic here
    return f"Processed: {input_text}"

demo = gr.Interface(
    fn=process,
    inputs=gr.Textbox(label="Input"),
    outputs=gr.Textbox(label="Output"),
    title="My AI Agent Demo",
    description="Description of what the agent does"
)

if __name__ == "__main__":
    demo.launch()
```

3. Test locally:
```bash
python app.py
```

### Deployment

#### Deploy to HuggingFace Spaces

1. Create a new Space at https://huggingface.co/spaces
2. Select "Gradio" as the SDK
3. Push your code:
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE
cd YOUR_SPACE
# Add your app.py and requirements.txt
git add .
git commit -m "Add demo"
git push
```

4. Your demo will be available at: `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE`

#### Deploy to Gradio Cloud

1. Add to your code:
```python
demo.launch(share=True)
```

2. Or deploy to Hugging Face directly from code:
```python
from gradio.deploy import HuggingFace
HuggingFace.deploy(demo, "space-name", api_token="YOUR_TOKEN")
```

## Option 2: Streamlit

Streamlit is great for data apps and dashboards.

### Setup

1. Install Streamlit:
```bash
pip install streamlit
```

2. Create your demo (`app.py`):
```python
import streamlit as st

st.title("My AI Agent Demo")
st.write("Description of your agent")

user_input = st.text_input("Enter your input:")

if st.button("Process"):
    # Your agent logic here
    result = f"Processed: {user_input}"
    st.success(result)
```

3. Test locally:
```bash
streamlit run app.py
```

### Deployment

#### Deploy to Streamlit Cloud

1. Push your code to GitHub
2. Go to https://streamlit.io/cloud
3. Connect your GitHub repository
4. Deploy with one click

Your app will be at: `https://YOUR_APP_NAME.streamlit.app`

#### Alternative: Deploy to Hugging Face Spaces

1. Create a Space with Streamlit SDK
2. Add `app.py` and `requirements.txt`
3. Push to the Space repository

## Option 3: HuggingFace Spaces

Direct deployment to HuggingFace Spaces.

### Setup

1. Create account at https://huggingface.co
2. Create new Space
3. Choose SDK: Gradio, Streamlit, or Static

### File Structure

```
your-space/
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── README.md          # Space documentation
└── .gitattributes     # Optional
```

### Example requirements.txt

```txt
gradio>=4.0.0
# or
streamlit>=1.28.0

# Add your dependencies
transformers
torch
numpy
pandas
```

## Embedding Demos in the Marketplace

Once your demo is hosted, update the demo page:

1. Open `pages/demo/[agent].tsx`
2. Update the `demoUrl` variable:

```typescript
const demoUrl = 'https://your-space.hf.space';
// or
const demoUrl = 'https://your-app.streamlit.app';
```

3. Uncomment the iframe code:

```typescript
<iframe
  src={demoUrl}
  className="w-full h-[800px]"
  title={`${agentName} Demo`}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  sandbox="allow-same-origin allow-scripts allow-forms"
/>
```

4. Remove or hide the "Demo Configuration Required" warning box

## Best Practices

### Performance
- Keep demos lightweight and fast
- Add loading states for better UX
- Optimize model loading times
- Consider caching for frequently used models

### Security
- Never expose API keys in frontend code
- Use environment variables for secrets
- Validate all user inputs
- Implement rate limiting if needed

### User Experience
- Provide clear instructions
- Show example inputs
- Add error handling
- Include loading indicators
- Make the interface intuitive

### Monitoring
- Track demo usage
- Monitor error rates
- Collect user feedback
- Measure performance metrics

## Advanced: Custom Hosting

If you need more control, you can host on:

- **AWS**: EC2, Lambda, ECS
- **Google Cloud**: Cloud Run, App Engine
- **Azure**: App Service, Container Instances
- **Vercel/Netlify**: For static or serverless demos
- **DigitalOcean**: Droplets or App Platform

### Example: Deploy with Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["python", "app.py"]
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure CORS headers on your demo server
2. **Iframe Not Loading**: Check iframe sandbox and allow attributes
3. **Slow Loading**: Optimize model loading, use caching
4. **API Limits**: Implement rate limiting and quotas

### Getting Help

- Gradio: https://gradio.app/docs/
- Streamlit: https://docs.streamlit.io/
- HuggingFace: https://huggingface.co/docs/hub/spaces

## Examples

### Gradio Example: Text Classification

```python
import gradio as gr
from transformers import pipeline

classifier = pipeline("sentiment-analysis")

def classify_text(text):
    result = classifier(text)[0]
    return f"{result['label']}: {result['score']:.2f}"

demo = gr.Interface(
    fn=classify_text,
    inputs=gr.Textbox(lines=3, placeholder="Enter text to analyze..."),
    outputs=gr.Textbox(label="Sentiment"),
    examples=[
        ["I love this product!"],
        ["This is terrible."],
        ["Not sure how I feel about this."],
    ]
)

demo.launch()
```

### Streamlit Example: Data Analysis

```python
import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Data Analysis Agent")

uploaded_file = st.file_uploader("Upload CSV", type="csv")

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.write("Data Preview:", df.head())
    
    column = st.selectbox("Select column to visualize:", df.columns)
    
    fig = px.histogram(df, x=column)
    st.plotly_chart(fig)
```

## Next Steps

1. Choose your hosting platform
2. Create your demo application
3. Deploy to the chosen platform
4. Test the demo thoroughly
5. Update the marketplace with the demo URL
6. Monitor usage and gather feedback
