"""
Demo data generator for hackathon presentation
Simulates realistic customer feedback from various sources
"""
import random
from datetime import datetime, timedelta
from typing import List, Dict


class DemoDataGenerator:
    def __init__(self):
        self.demo_tweets = [
            # Negative
            "Your customer service is absolutely terrible. Been waiting for 3 hours with no response! #frustrated",
            "This product broke after just 2 days. What a waste of money! Not recommending to anyone.",
            "Worst experience ever. The app keeps crashing and support is ignoring my emails. 😡",
            "I want my money back! This is not what was advertised. Feeling scammed.",
            "How hard is it to fix a simple bug? This has been broken for weeks now!",
            
            # Neutral
            "Just tried the new feature. It's okay, nothing special but works as expected.",
            "Customer service responded after 24 hours. Issue is being looked into.",
            "The product does what it says. Could be better but it's acceptable.",
            "Received my order today. Packaging was fine, product seems decent.",
            
            # Positive
            "Absolutely love this product! Best purchase I've made this year! ⭐⭐⭐⭐⭐",
            "Customer support was amazing! They resolved my issue in minutes. Thank you!",
            "This is exactly what I needed. Great quality and fast shipping! Highly recommend! 🎉",
            "Been using this for a month now and it's fantastic. Worth every penny!",
            "The team really listens to feedback. Just saw they added the feature I requested! 💯",
        ]
        
        self.demo_reddit_posts = [
            # Negative
            "Anyone else having issues with their service? Mine has been down all day and support is MIA.",
            "PSA: Don't waste your money on this. Quality is terrible and they won't refund.",
            "Really disappointed with the recent update. They removed features people actually used.",
            
            # Neutral
            "Has anyone tried the new version? Curious about the changes before updating.",
            "Looking for alternatives. This works but wondering if there's something better.",
            
            # Positive
            "Just want to say this company has the best customer service I've experienced!",
            "This product changed my workflow completely. Can't imagine going back!",
            "Shoutout to the dev team - the latest update is incredible! 🚀",
        ]
        
        self.demo_reviews = [
            # Negative
            "1/5 stars. Product arrived damaged and customer service was unhelpful. Very disappointed.",
            "Would give 0 stars if I could. Complete waste of money. Save yourself the trouble.",
            
            # Neutral  
            "3/5 stars. It's okay for the price. Nothing amazing but gets the job done.",
            
            # Positive
            "5/5! Exceeded my expectations. Great quality and amazing support team!",
            "Best product in its category. Highly recommend to everyone! ⭐⭐⭐⭐⭐",
        ]
        
        self.authors = [
            "john_doe", "sarah_smith", "tech_guru_99", "frustrated_customer",
            "happy_buyer", "review_master", "product_fan", "angry_user",
            "satisfied_client", "first_time_buyer", "loyal_customer", "skeptical_shopper"
        ]
    
    def generate_demo_mention(self) -> Dict:
        """Generate a single demo mention"""
        source = random.choice(["twitter", "reddit", "review", "support"])
        
        if source == "twitter":
            text = random.choice(self.demo_tweets)
        elif source == "reddit":
            text = random.choice(self.demo_reddit_posts)
        elif source == "review":
            text = random.choice(self.demo_reviews)
        else:  # support
            text = random.choice(self.demo_tweets + self.demo_reddit_posts)
        
        return {
            "source": source,
            "text": text,
            "author": random.choice(self.authors),
            "created_at": datetime.utcnow() - timedelta(minutes=random.randint(0, 60))
        }
    
    def generate_batch(self, count: int = 10) -> List[Dict]:
        """Generate multiple demo mentions"""
        return [self.generate_demo_mention() for _ in range(count)]
    
    def generate_crisis_scenario(self) -> List[Dict]:
        """Generate a crisis scenario with multiple negative mentions"""
        crisis_texts = [
            "URGENT: Major security breach! My account was compromised! 🚨",
            "This is unacceptable! Data leak affecting thousands of users!",
            "Everyone is reporting the same issue. This is a disaster!",
            "How is this company still in business? Absolute nightmare!",
            "Class action lawsuit incoming. This is criminal negligence!",
        ]
        
        mentions = []
        base_time = datetime.utcnow()
        
        for i, text in enumerate(crisis_texts):
            mentions.append({
                "source": random.choice(["twitter", "reddit"]),
                "text": text,
                "author": random.choice(self.authors),
                "created_at": base_time - timedelta(minutes=i*2)
            })
        
        return mentions


# Singleton instance
_demo_generator = None

def get_demo_generator() -> DemoDataGenerator:
    global _demo_generator
    if _demo_generator is None:
        _demo_generator = DemoDataGenerator()
    return _demo_generator
