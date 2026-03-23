from fastapi import FastAPI

app = FastAPI()

@app.get("/") 
def read_root():
    return {"message": "The OG timesheet autominator"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)