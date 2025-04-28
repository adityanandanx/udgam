from heatmap_agent import agent
import json

startup_markdown = """
1. Problem Statement
To provide automated personal safety to individuals in case of emergencies.

In moments of danger, the ability to call for help can be hindered by shock, fear, or physical restraint.
Women, particularly in cases of harassment, may be unable to call for help, due to fear of retaliation or ongoing control. Additionally, Older adults may have limited mobility, hearing/speech impairments, or cognitive challenges (like dementia), which can prevent them from responding quickly or clearly.
2. Proposed Solution
Build a smart wearable device(wrist mounted) which automatically detects fight or flight response of the user in case of emergencies like physical assault, fall, or any other medical emergency like heart attack, asthma attack etc.
The device connects to a companion android application which has additional features.
Analyze real-time heart rate, motion, voice input, and current location to send SOS alerts to emergency services, and also friends and family who currently are near the victim’s location.
We will develop an ML model taking reference of m-OCKRA AI model to determine fight or flight response.  Reference - https://scispace.com/pdf/m-ockra-an-efficient-one-class-classifier-for-personal-risk-2bn39noihf.pdf
Heart rate and movement data will act as input parameters for the model and output would be whether there is a fight or flight response or not.


3. System Functionality
User turns on ”SAFE MODE” which activates heart rate, movement, and location monitoring
Analyze the data using our AI model.
User has access to a map with all nearby unsafe locations flagged by other users within the last 12 hours
User can flag their current location as unsafe to warn other users
If the model detects a fight or flight response, we enter audio analysis mode in which we check for emergency keywords and also high pitched screams.
An SOS alert is sent to nearby friends and family, and also a direct call is connected to the emergency services.


4. Anonymous Survey
We conducted within Graphic Era and Other colleges -
Graphs - https://drive.google.com/file/d/1me9fMDtKgvQZzKamtob2_lBjhe1AUcQI/view?usp=sharing
Responses - https://docs.google.com/spreadsheets/d/1cYtsHx1GE48S0D8_0HUzUIqWQYJXeOGi4dLG2yKhbIw/edit?usp=sharing
The majority of responses validated our idea along with a lot of interest from women needing such a device. Some even shared their past experiences where it would have been very helpful.
5. Market Opportunity
There's increasing concern about personal safety, especially for:
Women in urban and rural areas
Children
Elderly with medical conditions
Night-shift workers
Our edge: Unlike standard smartwatches or panic buttons, nirbhay uses intelligent detection without requiring user interaction in high-stress situations.
6. Scalability and Future Vision
Ability to partially work with existing smartwatch brands like Google, Samsung, etc. eliminating the need for custom hardware
Build a data pipeline which improves upon the unsafe areas dataset based on real time crimes data scraped from news posts, and various other sources.
Detect epinephrine in sweat using a custom sensor, as it is secreted instantly during a fight-or-flight response.
"""

if __name__ == "__main__":
    heatmap_data = agent.invoke({"idea": startup_markdown})
    print("Agent Output:")
    print(json.dumps(heatmap_data, indent=2))
    print("\n\n\n")
    print("Heatmap Data:")
    print(json.dumps(heatmap_data["heatmap"], indent=2))
