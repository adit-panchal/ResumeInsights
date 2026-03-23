import subprocess
import os
import sys

def main():
    print("Starting Django backend and React frontend...")
    
    # Start Django backend
    backend = subprocess.Popen([sys.executable, 'manage.py', 'runserver'])
    
    # Start React frontend
    # Use shell=True for Windows to execute npm
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    frontend = subprocess.Popen([npm_cmd, 'run', 'dev'], cwd='frontend')
    
    try:
        backend.wait()
        frontend.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend.terminate()
        frontend.terminate()
        print("Servers stopped.")

if __name__ == '__main__':
    main()
