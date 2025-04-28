import pandas as pd
import os


def fetch_data():
    """
    Fetches data from various CSV files and returns them as pandas DataFrames.
    """
    # Get the absolute path to the data directory
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(current_dir, "data")

    # Load data from CSV files
    district_data = pd.read_csv(os.path.join(data_dir, "district_data.csv"))
    population_data = pd.read_csv(os.path.join(data_dir, "district_population.csv"))
    internet_data = pd.read_csv(os.path.join(data_dir, "internet_penetration.csv"))
    startup_data = pd.read_csv(os.path.join(data_dir, "startup_ecosystem.csv"))
    infrastructure_data = pd.read_csv(
        os.path.join(data_dir, "infrastructure_index.csv")
    )
    education_data = pd.read_csv(os.path.join(data_dir, "education_data.csv"))
    healthcare_data = pd.read_csv(os.path.join(data_dir, "healthcare_data.csv"))
    factor_weights = pd.read_csv(os.path.join(data_dir, "factor_weights.csv"))

    return (
        district_data,
        population_data,
        internet_data,
        startup_data,
        infrastructure_data,
        education_data,
        healthcare_data,
        factor_weights,
    )
