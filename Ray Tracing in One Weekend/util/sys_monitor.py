import psutil
import GPUtil


def system_monitor():

    cpu_percent = psutil.cpu_percent()
    ram_percent = psutil.virtual_memory().percent

    # CPU temp (may fail on Windows)
    try:
        temps = psutil.sensors_temperatures()
        cpu_temp = temps["coretemp"][0].current
    except:
        cpu_temp = "N/A"

    # GPU info
    try:
        gpus = GPUtil.getGPUs()

        if gpus:
            gpu = gpus[0]

            gpu_load = gpu.load * 100
            gpu_temp = gpu.temperature
            gpu_memory = gpu.memoryUsed
        else:
            gpu_load = "N/A"
            gpu_temp = "N/A"
            gpu_memory = "N/A"

    except:
        gpu_load = "N/A"
        gpu_temp = "N/A"
        gpu_memory = "N/A"

    return {
        "CPU": f"{cpu_percent:.1f}%",
        "RAM": f"{ram_percent:.1f}%",
        "CPU Temp": f"{cpu_temp}",
        "GPU Temp": f"{gpu_temp}°C",
        "VRAM": f"{gpu_memory}MB"
    }